import * as Plot from "@observablehq/plot";
import type { BenchResult, DataType } from "@schema-benchmarks/bench";
import type { ErrorType } from "@schema-benchmarks/schemas";
import {
  durationFormatter,
  getDuration,
  uniqueBy,
} from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
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

const getLibraryName = (d: BenchResult) => {
  const [libraryName] = d.libraryName.split(" (");
  return libraryName;
};

export const BenchPlot = createPlotComponent(function useBenchPlot({
  type,
  dataType,
  errorType,
}: BenchPlotProps) {
  const { data } = useSuspenseQuery({
    ...getBenchResults(),
    select: (results) =>
      type === "initialization" ? results[type] : results[type][dataType],
  });
  const values = useMemo(
    () =>
      uniqueBy(
        errorType
          ? data.filter(
              (d) => d.type === "parsing" && d.errorType === errorType,
            )
          : data,
        getLibraryName,
      ),
    [data, errorType],
  );
  const [domRect, ref] = useElementSize();
  const plot = useMemo(
    () =>
      Plot.plot({
        style: {
          fontFamily: "var(--font-family-body)",
          textTransform: "none",
        },
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
              (d.throws ? " *" : "") +
              (d.type === "parsing" && d.errorType === "abortEarly"
                ? " †"
                : ""),
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
