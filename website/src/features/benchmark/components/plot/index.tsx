import * as Plot from "@observablehq/plot";
import type { BenchResult, DataType } from "@schema-benchmarks/bench";
import {
  durationFormatter,
  getDuration,
  uniqueBy,
} from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { createPlotComponent } from "@/components/plot";
import { color } from "@/data/scale";
import { useElementSize } from "@/hooks/use-content-box-size";
import { getBenchResults } from "../../query";

export type BenchPlotProps =
  | {
      type: "initialization";
      dataType?: never;
    }
  | {
      type: "validation" | "parsing";
      dataType: DataType;
    };

const getLibraryName = (d: BenchResult) => {
  const [libraryName] = d.libraryName.split(" (");
  return libraryName;
};

export const BenchPlot = createPlotComponent(function useBenchPlot({
  type,
  dataType,
}: BenchPlotProps) {
  const { data } = useSuspenseQuery({
    ...getBenchResults(),
    select: (results) =>
      type === "initialization" ? results[type] : results[type][dataType],
  });
  const values = useMemo(() => uniqueBy(data, getLibraryName), [data]);
  const [domRect, ref] = useElementSize();
  const plot = useMemo(
    () =>
      Plot.plot({
        marginLeft: 48,
        width: domRect?.width,
        x: {
          tickSpacing: 150,
        },
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
            x: (d: BenchResult) =>
              d.libraryName +
              (d.note ? ` (${d.note})` : "") +
              (d.throws ? "*" : ""),
            y: "mean",
            fill: "mean",
            sort: { x: "y" },
          }),
        ],
      }),
    [values, domRect?.width],
  );
  return { plot, ref };
});

BenchPlot.displayName = "BenchPlot";
