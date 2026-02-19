import * as Plot from "@observablehq/plot";
import type { BenchResult, DataType } from "@schema-benchmarks/bench";
import type { ErrorType } from "@schema-benchmarks/schemas";
import { durationFormatter, getDuration, uniqueBy } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { formatLibraryName } from "#/routes/_benchmarks/-lib";
import { createPlotComponent } from "#/shared/components/plot";
import { color } from "#/shared/data/scale";
import { useElementSize } from "#/shared/hooks/use-content-box-size";

import { getBenchResults } from "../../-query";

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
      type: "parsing";
      dataType: DataType;
      errorType?: ErrorType;
    };

const getLabel = (d: BenchResult) =>
  formatLibraryName(d.libraryName) +
  (d.throws ? " *" : "") +
  (d.type === "parsing" && d.errorType === "abortEarly" ? " †" : "");

export const BaseBenchPlot = createPlotComponent(function useBenchPlot({
  data,
}: {
  data: Array<BenchResult>;
}) {
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
        y: {
          grid: true,
          label: "Time",
          tickFormat: (d: number) => durationFormatter.format(getDuration(d)),
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
          }),
        ],
      }),
    [values, minWidth, domRect?.width],
  );
  return { plot, ref, minWidth };
});

BaseBenchPlot.displayName = "BaseBenchPlot";

export function BenchPlot({ type, dataType, errorType }: BenchPlotProps) {
  const { data } = useSuspenseQuery({
    ...getBenchResults(),
    select: (results) => (type === "initialization" ? results[type] : results[type][dataType]),
  });
  const filteredData = useMemo(() => {
    if (errorType) {
      return data.filter((d) => d.type === "parsing" && d.errorType === errorType);
    }
    return data;
  }, [data, errorType]);
  return <BaseBenchPlot data={filteredData} />;
}
