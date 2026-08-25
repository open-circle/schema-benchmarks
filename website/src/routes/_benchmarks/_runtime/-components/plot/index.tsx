import * as Plot from "@observablehq/plot";
import type { RuntimeResult, BenchResults, DataType } from "@schema-benchmarks/bench";
import type { ErrorType } from "@schema-benchmarks/schemas";
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
      type: "validation";
      dataType: DataType;
      errorType?: never;
    }
  | {
      type: "parsing" | "standard";
      dataType: DataType;
      errorType?: ErrorType;
    };

const getLabel = (d: RuntimeResult) =>
  d.libraryName +
  (d.throws ? " *" : "") +
  (d.errorType === "abortEarly" ? " †" : "") +
  (d.sameObj ? " ‡" : "");

export const BaseBenchPlot = createPlotComponent(function useBenchPlot({
  data,
}: {
  data: Array<Exclude<RuntimeResult, { type: "codec" }>>;
}) {
  const formatNumber = useNumberFormatter(shortNumFormatter);
  const values = useMemo(() => uniqueBy(data, (d) => d.libraryName), [data]);
  const [domRect, ref] = useElementSize();
  const { height, marginLeft } = useMemo(() => {
    const longestLabel = values.reduce((a, b) => (getLabel(a).length > getLabel(b).length ? a : b));
    return {
      height: Math.max(176, values.length * 28 + 52),
      marginLeft: Math.max(84, getLabel(longestLabel).length * 7 + 24),
    };
  }, [values]);
  const plot = useMemo(
    () =>
      Plot.plot({
        style: {
          fontFamily: "var(--font-family-body)",
          textTransform: "none",
        },
        marginLeft,
        width: domRect?.width ?? 0,
        height,
        x: {
          grid: true,
          label: "Time",
          tickFormat: (d: number) => formatDuration(d, 2),
          nice: true,
        },
        y: {
          label: "Library",
          tickSize: 0,
        },
        color: {
          type: "quantize",
          reverse: true,
          range: color,
        },
        marks: [
          Plot.ruleX([0]),
          Plot.dotX(values, {
            x: "mean",
            y: { value: getLabel, label: "Library" },
            fill: "mean",
            r: 5,
            symbol: "diamond2",
            sort: { y: "x" },
            tip: {
              pointer: "y",
              className: "plot__tooltip",
              pathFilter: "",
              format: {
                x: (d: number) => `${formatNumber(d)} ms (${formatDuration(d, 2)})`,
                y: (d: string) => d,
                fill: false,
              },
            },
          }),
        ],
      }),
    [values, height, marginLeft, domRect?.width, formatNumber],
  );
  return { plot, ref };
});

BaseBenchPlot.displayName = "BaseBenchPlot";

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
