import * as Plot from "@observablehq/plot";
import type { BenchResult, DataType } from "@schema-benchmarks/bench";
import {
  durationFormatter,
  getDuration,
  uniqueBy,
} from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ClientOnly } from "@tanstack/react-router";
import { useMemo } from "react";
import { PlotContainer } from "@/components/plot";
import { color } from "@/data/scale";
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

export function BenchPlot({ type, dataType }: BenchPlotProps) {
  const { data } = useSuspenseQuery({
    ...getBenchResults(),
    select: (results) =>
      type === "initialization" ? results[type] : results[type][dataType],
  });
  const values = useMemo(() => uniqueBy(data, getLibraryName), [data]);
  const plot = useMemo(
    () =>
      Plot.plot({
        marginLeft: 48,
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
            x: getLibraryName,
            y: "mean",
            fill: "mean",
            sort: { x: "y" },
          }),
        ],
      }),
    [values],
  );
  return (
    <ClientOnly>
      <PlotContainer plot={plot} />
    </ClientOnly>
  );
}
