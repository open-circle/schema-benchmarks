import type { CodecResult } from "@schema-benchmarks/bench";
import {
  durationFormatter,
  compareNumbers,
  getDuration,
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
import { scaleLog } from "d3";
import { Suspense, useMemo, useState } from "react";

import { getBenchResults } from "#src/routes/_benchmarks/_runtime/-query";
import { Checkbox, ControlLabel } from "#src/shared/components/checkbox";
import { ResponsiveCodeBlock } from "#src/shared/components/code";
import { ColorDisplay } from "#src/shared/components/color";
import { getVerticalOffsets } from "#src/shared/components/plot/offset";
import { type PlotScale, PlotScaleToggle } from "#src/shared/components/plot/scale-toggle";
import { ChartTooltipBody, getRank } from "#src/shared/components/plot/tooltip";
import { Spinner } from "#src/shared/components/spinner";
import { useNumberFormatter } from "#src/shared/hooks/format/use-number-formatter";

const getBehavior = (d: CodecResult) => (d.acceptsUnknown ? "Accepts unknown input" : undefined);

const getPointKey = (point: { library: string; note?: string; operation: string }) =>
  `${point.library}:${point.note ?? ""}:${point.operation}`;

export function BaseCodecPlot({ data }: { data: Array<CodecResult> }) {
  const [showAllVariants, setShowAllVariants] = useState(false);
  const [scale, setScale] = useState<PlotScale>("linear");
  const formatNumber = useNumberFormatter(shortNumFormatter);

  // When collapsed, show only the best variant per library
  const sortedData = useMemo(
    () => data.toSorted(compareNumbers((result) => result.encode.mean + result.decode.mean)),
    [data],
  );
  const collapsedData = useMemo(() => uniqueBy(sortedData, (d) => d.libraryName), [sortedData]);
  const displayData = showAllVariants ? sortedData : collapsedData;
  const isCheckboxDisabled = data.length === collapsedData.length;

  // Every codec benchmark variant for a library is shown, not just the first one.
  const points = useMemo(
    () =>
      displayData.flatMap((result) => [
        {
          library: result.libraryName,
          operation: "Encode",
          mean: result.encode.mean,
          note: result.note,
          behavior: getBehavior(result),
          snippet: result.encode.snippet,
        },
        {
          library: result.libraryName,
          operation: "Decode",
          mean: result.decode.mean,
          note: result.note,
          behavior: getBehavior(result),
          snippet: result.decode.snippet,
        },
      ]),
    [displayData],
  );
  const canUseLogScale = points.length > 0 && points.every((point) => point.mean > 0);
  const activeScale = scale === "log" && canUseLogScale ? "log" : "linear";
  const verticalOffsets = useMemo(
    () => getVerticalOffsets(points, (point) => point.library, getPointKey),
    [points],
  );
  const libraries = useMemo(
    () =>
      uniqueBy(displayData, (d) => d.libraryName)
        .toSorted(compareNumbers((result) => Math.min(result.encode.mean, result.decode.mean)))
        .map((d) => d.libraryName),
    [displayData],
  );
  const height = Math.max(176, libraries.length * 28 + 52);
  const definition = useMemo(() => {
    const marks = [
      text(points, {
        id: "codec-results",
        key: getPointKey,
        x: "mean",
        y: "library",
        dy: (point) => verticalOffsets.get(getPointKey(point)) ?? 0,
        color: "operation",
        text: () => "stat_0",
        anchor: "middle",
        fontSize: 18,
      }),
      whenFocused(
        text(points, {
          id: "codec-focus",
          key: getPointKey,
          x: "mean",
          y: "library",
          dy: (point) => verticalOffsets.get(getPointKey(point)) ?? 0,
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
            ticks: {
              format: (duration: number) => durationFormatter.format(getDuration(duration)),
            },
          },
        },
        y: {
          scale: scaleBand().domain(libraries).padding(0.2),
          axis: { label: "Library", ticks: { size: 0, padding: 8 } },
        },
      },
      color: { domain: ["Encode", "Decode"], range: ["var(--link)", "var(--button)"] },
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
  }, [activeScale, libraries, points, verticalOffsets]);

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
        ariaLabel="Codec benchmark results"
        className="plot-container"
        definition={definition}
        height={height}
        renderTooltipBody={({ points: focusedPoints }) => {
          const focusedPoint = focusedPoints[0];
          if (!focusedPoint) return null;
          const point = focusedPoint.datum;
          if (!point) return null;
          const operationPoints = points.filter(
            (candidate) => candidate.operation === point.operation,
          );
          return (
            <ChartTooltipBody subhead={point.library}>
              <dl>
                <div>
                  <dt>{point.operation}</dt>
                  <dd>
                    <ColorDisplay color={focusedPoint.color} size="small" />
                    {`${formatNumber(point.mean)} ms (${durationFormatter.format(getDuration(point.mean, 2))})`}
                  </dd>
                </div>
                <div>
                  <dt>Rank</dt>
                  <dd>
                    {formatNumber(
                      getRank(operationPoints, point, (candidate) => candidate.mean, true),
                    )}{" "}
                    / {formatNumber(operationPoints.length)}
                  </dd>
                </div>
                {point.note && (
                  <div>
                    <dt>Note</dt>
                    <dd>{point.note}</dd>
                  </div>
                )}
                {point.behavior && (
                  <div>
                    <dt>Behavior</dt>
                    <dd>{point.behavior}</dd>
                  </div>
                )}
              </dl>
              {point.snippet && (
                <Suspense fallback={<Spinner />}>
                  <ResponsiveCodeBlock>{point.snippet}</ResponsiveCodeBlock>
                </Suspense>
              )}
            </ChartTooltipBody>
          );
        }}
      />
    </div>
  );
}

export function CodecPlot() {
  const { data } = useSuspenseQuery({
    ...getBenchResults(),
    select: (results) => results.codec,
  });
  return <BaseCodecPlot data={data} />;
}
