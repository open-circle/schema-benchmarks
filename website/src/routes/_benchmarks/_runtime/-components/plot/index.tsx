import type { RuntimeResult, BenchResults, DataType } from "@schema-benchmarks/bench";
import type { ErrorType } from "@schema-benchmarks/schemas";
import {
  compareNumbers,
  formatDuration,
  shortNumFormatter,
  uniqueBy,
} from "@schema-benchmarks/utils";
import { defineChart, text, whenFocused } from "@tanstack/charts";
import type { ChartSpec } from "@tanstack/charts";
import { Chart } from "@tanstack/charts/react/tooltip";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import { portal } from "@tanstack/charts/tooltip/portal";
import { useSuspenseQuery } from "@tanstack/react-query";
import { scaleLog, scaleQuantize } from "d3";
import { Suspense, useMemo, useState } from "react";

import { errorTypeProps, optimizeTypeProps } from "#src/routes/_benchmarks/_runtime/-constants";
import { getBenchResults } from "#src/routes/_benchmarks/_runtime/-query";
import { Checkbox, ControlLabel } from "#src/shared/components/checkbox";
import { CodeBlock } from "#src/shared/components/code";
import { ColorDisplay } from "#src/shared/components/color/index.tsx";
import { getVerticalOffsets } from "#src/shared/components/plot/offset";
import { type PlotScale, PlotScaleToggle } from "#src/shared/components/plot/scale-toggle";
import { ChartTooltipBody, getRank } from "#src/shared/components/plot/tooltip";
import { Spinner } from "#src/shared/components/spinner/index.tsx";
import { color } from "#src/shared/data/scale";
import { useNumberFormatter } from "#src/shared/hooks/format/use-number-formatter";

export type BenchPlotProps =
  | {
      type: "initialization";
      dataType?: never;
      errorType?: never;
    }
  | {
      type: "validation";
      dataType: DataType;
      errorType?: never;
    }
  | {
      type: "parsing" | "standard";
      dataType: DataType;
      errorType?: ErrorType;
    };

type BenchResult = Exclude<RuntimeResult, { type: "codec" }>;

const getOptimizations = (d: BenchResult) => optimizeTypeProps.labels[d.optimizeType].label;

const getErrorHandling = (d: BenchResult) =>
  d.errorType ? errorTypeProps.labels[d.errorType].label : undefined;

const getResultKey = (result: BenchResult) =>
  `${result.libraryName}:${result.note ?? ""}:${result.mean}`;

const getBehavior = (d: BenchResult) => {
  const behaviors = [d.throws && "Throws", d.sameObj && "Returns the same object"].filter(
    (behavior) => behavior !== false && behavior !== undefined,
  );
  return behaviors.length > 0 ? behaviors.join(", ") : undefined;
};

export function BaseBenchPlot({ data }: { data: Array<BenchResult> }) {
  const [showAllVariants, setShowAllVariants] = useState(false);
  const [scale, setScale] = useState<PlotScale>("linear");
  const formatNumber = useNumberFormatter(shortNumFormatter);

  // When collapsed, show only the best variant per library
  const sortedData = useMemo(() => data.toSorted(compareNumbers((result) => result.mean)), [data]);
  const collapsedData = useMemo(() => uniqueBy(sortedData, (d) => d.libraryName), [sortedData]);
  const displayData = showAllVariants ? sortedData : collapsedData;
  const isCheckboxDisabled = data.length === collapsedData.length;
  const canUseLogScale = displayData.length > 0 && displayData.every((result) => result.mean > 0);
  const activeScale = scale === "log" && canUseLogScale ? "log" : "linear";
  const verticalOffsets = useMemo(
    () => getVerticalOffsets(displayData, (result) => result.libraryName, getResultKey),
    [displayData],
  );
  const libraries = useMemo(
    () =>
      uniqueBy(displayData, (d) => d.libraryName)
        .toSorted(compareNumbers((result) => result.mean))
        .map((d) => d.libraryName),
    [displayData],
  );
  const height = Math.max(176, libraries.length * 28 + 52);
  const definition = useMemo(() => {
    const marks = [
      text(displayData, {
        id: "runtime-results",
        key: getResultKey,
        x: "mean",
        y: "libraryName",
        dy: (result) => verticalOffsets.get(getResultKey(result)) ?? 0,
        color: "mean",
        text: () => "stat_0",
        anchor: "middle",
        fontSize: 18,
      }),
      whenFocused(
        text(displayData, {
          id: "runtime-focus",
          key: getResultKey,
          x: "mean",
          y: "libraryName",
          dy: (result) => verticalOffsets.get(getResultKey(result)) ?? 0,
          fill: "currentColor",
          text: () => "nearby",
          anchor: "middle",
          fontSize: 18,
        }),
      ),
    ] as const;
    const spec = {
      marks,
      scales: {
        x: {
          scale: activeScale === "log" ? scaleLog : scaleLinear,
          grid: true,
          nice: true,
          axis: {
            label: "Time",
            ticks: { format: (duration: number) => formatDuration(duration, 2) },
          },
        },
        y: {
          scale: scaleBand().domain(libraries).padding(0.2),
          axis: { label: "Library", ticks: { size: 0, padding: 8 } },
        },
      },
      color: { scale: () => scaleQuantize(color.toReversed()) },
    } satisfies ChartSpec<typeof marks>;

    return defineChart(() => spec, {
      focusRing: false,
      svgAnimation: { duration: 200, easing: "ease-out", respectReducedMotion: true },
      tooltip: {
        use: tooltip,
        portal,
        className: "chart-tooltip",
        placement: ["right", "left", "bottom", "top"],
      },
    });
  }, [activeScale, displayData, libraries, verticalOffsets]);

  const controls = (
    <>
      <ControlLabel>
        <Checkbox
          asLabel={false}
          checked={showAllVariants}
          onChange={(e) => setShowAllVariants(e.currentTarget.checked)}
          disabled={isCheckboxDisabled}
        />
        Show all variants
      </ControlLabel>
      <PlotScaleToggle value={activeScale} onChange={setScale} logDisabled={!canUseLogScale} />
    </>
  );

  return (
    <div className="plot-scroll-container">
      <div className="plot-controls">{controls}</div>
      <Chart
        ariaLabel="Runtime benchmark results"
        className="plot-container"
        definition={definition}
        height={height}
        renderTooltipBody={({ points }) => {
          const point = points[0];
          if (!point) return null;
          const result = point.datum;
          return (
            <ChartTooltipBody subhead={result.libraryName}>
              <dl>
                <div>
                  <dt>Time</dt>
                  <dd>
                    <ColorDisplay color={point.color} size="small" />
                    {`${formatNumber(result.mean)} ms (${formatDuration(result.mean, 2)})`}
                  </dd>
                </div>
                <div>
                  <dt>Rank</dt>
                  <dd>
                    {formatNumber(
                      getRank(displayData, result, (candidate) => candidate.mean, true),
                    )}{" "}
                    / {formatNumber(displayData.length)}
                  </dd>
                </div>
                {result.note && (
                  <div>
                    <dt>Note</dt>
                    <dd>{result.note}</dd>
                  </div>
                )}
                <div>
                  <dt>Optimizations</dt>
                  <dd>{getOptimizations(result)}</dd>
                </div>
                {getErrorHandling(result) && (
                  <div>
                    <dt>Error handling</dt>
                    <dd>{getErrorHandling(result)}</dd>
                  </div>
                )}
                {getBehavior(result) && (
                  <div>
                    <dt>Behavior</dt>
                    <dd>{getBehavior(result)}</dd>
                  </div>
                )}
              </dl>
              {result.snippet && (
                <Suspense fallback={<Spinner />}>
                  <CodeBlock>{result.snippet}</CodeBlock>
                </Suspense>
              )}
            </ChartTooltipBody>
          );
        }}
      />
    </div>
  );
}

const selectResults = (results: BenchResults, props: BenchPlotProps) => {
  if (props.type === "initialization") return results[props.type];
  return results[props.type][props.dataType];
};

export function BenchPlot(props: BenchPlotProps) {
  const { errorType } = props;
  const { data } = useSuspenseQuery({
    ...getBenchResults(),
    select: (results) => selectResults(results, props),
  });
  const filteredData = useMemo(() => {
    if (errorType) {
      return data.filter(
        (d) => (d.type === "parsing" || d.type === "standard") && d.errorType === errorType,
      );
    }
    return data;
  }, [data, errorType]);
  return <BaseBenchPlot data={filteredData} />;
}
