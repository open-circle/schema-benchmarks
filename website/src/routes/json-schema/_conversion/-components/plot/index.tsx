import type { JsonSchemaConversionResult } from "@schema-benchmarks/bench";
import type { JsonSchemaDirection, JsonSchemaConversionTarget } from "@schema-benchmarks/schemas";
import type { OneOf } from "@schema-benchmarks/utils";
import {
  formatDuration,
  shallowFilter,
  shortNumFormatter,
  uniqueBy,
} from "@schema-benchmarks/utils";
import { defineChart, ruleX, text, whenFocused } from "@tanstack/charts";
import type { ChartSpec } from "@tanstack/charts";
import { Chart } from "@tanstack/charts/react/tooltip";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import { portal } from "@tanstack/charts/tooltip/portal";
import { useSuspenseQuery } from "@tanstack/react-query";
import { scaleQuantize } from "d3";
import { useMemo } from "react";

import { getJsonSchemaBenchResults } from "#src/routes/json-schema/-query.ts";
import { ChartTooltipBody } from "#src/shared/components/plot/tooltip";
import { color } from "#src/shared/data/scale";
import { useNumberFormatter } from "#src/shared/hooks/format/use-number-formatter";

const getLabel = (d: JsonSchemaConversionResult) => d.libraryName;

export function BaseJsonConversionPlot({ data }: { data: Array<JsonSchemaConversionResult> }) {
  const formatNumber = useNumberFormatter(shortNumFormatter);
  const values = useMemo(() => uniqueBy(data, (d) => d.libraryName), [data]);
  const height = Math.max(176, values.length * 28 + 52);
  const definition = useMemo(() => {
    const marks = [
      ruleX([0], { stroke: "currentColor" }),
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
          scale: scaleLinear,
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
        scale: () => scaleQuantize(color),
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
  }, [formatNumber, values]);

  return (
    <Chart
      ariaLabel="JSON Schema conversion benchmark results"
      className="plot-container"
      definition={definition}
      height={height}
      renderTooltipBody={({ points }) => {
        const result = points[0]?.datum;
        if (!result) return null;
        return (
          <ChartTooltipBody subhead={result.libraryName}>
            <dl>
              <div>
                <dt>Time</dt>
                <dd>{`${formatNumber(result.mean)} ms (${formatDuration(result.mean, 2)})`}</dd>
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
