import * as Plot from "@observablehq/plot";
import type { BenchResult, BenchResults, DataType } from "@schema-benchmarks/bench";
import type { ErrorType, JsonSchemaDirection, JsonSchemaTarget } from "@schema-benchmarks/schemas";
import { formatDuration, shortNumFormatter, uniqueBy } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { getBenchResults } from "#src/routes/_benchmarks/_runtime/-query";
import { createPlotComponent } from "#src/shared/components/plot";
import { color } from "#src/shared/data/scale";
import { useNumberFormatter } from "#src/shared/hooks/format/use-number-formatter";
import { useElementSize } from "#src/shared/hooks/use-content-box-size";

export type BenchPlotProps =
  | {
      type: "initialization";
      dataType?: never;
      errorType?: never;
    }
  | {
      type: "jsonSchema";
      target: JsonSchemaTarget;
      direction: JsonSchemaDirection;
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

const getLabel = (d: BenchResult) =>
  d.libraryName +
  (d.throws ? " *" : "") +
  ((d.type === "parsing" || d.type === "standard") && d.errorType === "abortEarly" ? " †" : "");

export const BaseBenchPlot = createPlotComponent(function useBenchPlot({
  data,
}: {
  data: Array<Exclude<BenchResult, { type: "codec" }>>;
}) {
  const formatNumber = useNumberFormatter(shortNumFormatter);
  const values = useMemo(() => uniqueBy(data, (d) => d.libraryName), [data]);
  const [domRect, ref] = useElementSize();
  const marginLeft = data[0]?.type === "initialization" ? 84 : 48;
  const minWidth = useMemo(() => {
    const longestLabel = values.reduce((a, b) => (getLabel(a).length > getLabel(b).length ? a : b));
    return values.length * (getLabel(longestLabel).length * 6) + marginLeft;
  }, [values, marginLeft]);
  const plot = useMemo(
    () =>
      Plot.plot({
        style: {
          fontFamily: "var(--font-family-body)",
          textTransform: "none",
        },
        marginLeft,
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
    [values, minWidth, marginLeft, domRect?.width, formatNumber],
  );
  return { plot, ref, minWidth };
});

BaseBenchPlot.displayName = "BaseBenchPlot";

const selectResults = (results: BenchResults, props: BenchPlotProps) => {
  if (props.type === "initialization") return results[props.type];
  if (props.type === "jsonSchema") {
    return results[props.type].filter(
      (result) => result.target === props.target && result.direction === props.direction,
    );
  }
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
