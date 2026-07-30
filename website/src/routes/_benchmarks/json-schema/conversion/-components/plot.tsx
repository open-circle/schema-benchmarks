import * as Plot from "@observablehq/plot";
import type { JsonSchemaResult } from "@schema-benchmarks/bench";
import type { JsonSchemaDirection, JsonSchemaTarget } from "@schema-benchmarks/schemas";
import { formatDuration, shortNumFormatter, uniqueBy } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { getJsonSchemaBenchResults } from "#src/routes/_benchmarks/json-schema/-query";
import { createPlotComponent } from "#src/shared/components/plot";
import { color } from "#src/shared/data/scale";
import { useNumberFormatter } from "#src/shared/hooks/format/use-number-formatter";
import { useElementSize } from "#src/shared/hooks/use-content-box-size";

const getLabel = (d: JsonSchemaResult) => d.libraryName + (d.throws ? " *" : "");

export const BaseJsonSchemaPlot = createPlotComponent(function useBenchPlot({
  data,
}: {
  data: Array<JsonSchemaResult>;
}) {
  const formatNumber = useNumberFormatter(shortNumFormatter);
  const values = useMemo(() => uniqueBy(data, (d) => d.libraryName), [data]);
  const [domRect, ref] = useElementSize();
  const minWidth = useMemo(() => {
    const longestLabel = values.reduce((a, b) => (getLabel(a).length > getLabel(b).length ? a : b));
    return values.length * (getLabel(longestLabel).length * 6) + 48;
  }, [values]);
  const plot = useMemo(
    () =>
      Plot.plot({
        style: {
          fontFamily: "var(--font-family-body)",
          textTransform: "none",
        },
        marginLeft: 48,
        width: Math.max(domRect?.width ?? 0, minWidth),
        x: {
          label: "Library",
        },
        y: {
          grid: true,
          label: "Time",
          tickFormat: (d: number) => formatDuration(d, 2),
          nice: true,
        },
        color: {
          type: "quantize",
          reverse: true,
          range: color,
        },
        marks: [
          Plot.ruleY([0]),
          Plot.barY(values, {
            x: getLabel,
            y: "mean",
            fill: "mean",
            sort: { x: "y" },
            tip: {
              pointer: "x",
              className: "plot__tooltip",
              pathFilter: "",
              format: {
                y: (d: number) => `${formatNumber(d)} ms (${formatDuration(d, 2)})`,
                fill: false,
              },
            },
          }),
        ],
      }),
    [values, minWidth, domRect?.width, formatNumber],
  );
  return { plot, ref, minWidth };
});

BaseJsonSchemaPlot.displayName = "BaseJsonSchemaPlot";

export interface JsonSchemaPlotProps {
  target: JsonSchemaTarget;
  direction: JsonSchemaDirection;
}

export function JsonSchemaPlot({ target, direction }: JsonSchemaPlotProps) {
  const { data } = useSuspenseQuery({
    ...getJsonSchemaBenchResults(),
    select: (results) =>
      results.bench.filter((r) => r.target === target && r.direction === direction),
  });
  return <BaseJsonSchemaPlot data={data} />;
}
