import type { JsonSchemaConversionResult } from "@schema-benchmarks/bench";
import type { JsonSchemaDirection, JsonSchemaConversionTarget } from "@schema-benchmarks/schemas";
import type { OneOf } from "@schema-benchmarks/utils";
import {
  formatDuration,
  shallowFilter,
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
import { useMemo, useState } from "react";

import { getJsonSchemaBenchResults } from "#src/routes/json-schema/-query.ts";
import { ColorDisplay } from "#src/shared/components/color";
import { type PlotScale, PlotScaleToggle } from "#src/shared/components/plot/scale-toggle";
import { ChartTooltipBody, getRank } from "#src/shared/components/plot/tooltip";
import { color } from "#src/shared/data/scale";
import { useNumberFormatter } from "#src/shared/hooks/format/use-number-formatter";

const getLabel = (d: JsonSchemaConversionResult) => d.libraryName;

export function BaseJsonConversionPlot({ data }: { data: Array<JsonSchemaConversionResult> }) {
  const [scale, setScale] = useState<PlotScale>("linear");
  const formatNumber = useNumberFormatter(shortNumFormatter);
  const values = useMemo(() => uniqueBy(data, (d) => d.libraryName), [data]);
  const canUseLogScale = values.length > 0 && values.every((result) => result.mean > 0);
  const activeScale = scale === "log" && canUseLogScale ? "log" : "linear";
  const height = Math.max(176, values.length * 28 + 52);
  const definition = useMemo(() => {
    const marks = [
      text(values, {
        id: "conversion-results",
        key: (result) => `${result.libraryName}:${result.mean}`,
        x: "mean",
        y: getLabel,
        color: "mean",
        text: () => "stat_0",
        anchor: "middle",
        fontSize: 18,
      }),
      whenFocused(
        text(values, {
          id: "conversion-focus",
          key: (result) => `${result.libraryName}:${result.mean}`,
          x: "mean",
          y: getLabel,
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
              format: (duration: number) =>
                `${formatNumber(duration)} ms (${formatDuration(duration, 2)})`,
            },
          },
        },
        y: {
          scale: () => scaleBand().padding(0.2),
          axis: { label: "Library", ticks: { size: 0, padding: 8 } },
        },
      },
      color: {
        scale: () => scaleQuantize(color.toReversed()),
      },
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
  }, [activeScale, formatNumber, values]);

  return (
    <div className="plot-scroll-container">
      <div className="plot-controls">
        <PlotScaleToggle value={activeScale} onChange={setScale} logDisabled={!canUseLogScale} />
      </div>
      <Chart
        ariaLabel="JSON Schema conversion benchmark results"
        className="plot-container"
        definition={definition}
        height={height}
        renderTooltipBody={({ points }) => {
          const point = points[0];
          if (!point) return null;
          const result = point.datum;
          if (!result) return null;
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
                    {formatNumber(getRank(values, result, (candidate) => candidate.mean, true))} /{" "}
                    {formatNumber(values.length)}
                  </dd>
                </div>
                {result.note && (
                  <div>
                    <dt>Note</dt>
                    <dd>{result.note}</dd>
                  </div>
                )}
              </dl>
            </ChartTooltipBody>
          );
        }}
      />
    </div>
  );
}

export type JsonConversionPlotProps = OneOf<
  | {
      conversionType: "toJson";
      target: JsonSchemaConversionTarget;
      direction: JsonSchemaDirection;
    }
  | {
      conversionType: "fromJson";
    }
>;

export function JsonConversionPlot({ conversionType, target, direction }: JsonConversionPlotProps) {
  const { data } = useSuspenseQuery({
    ...getJsonSchemaBenchResults(),
    select: (results) => {
      if (conversionType === "toJson") {
        return results.conversion.toJson.filter(shallowFilter({ target, direction }));
      }
      return results.conversion.fromJson;
    },
  });
  return <BaseJsonConversionPlot data={data} />;
}
