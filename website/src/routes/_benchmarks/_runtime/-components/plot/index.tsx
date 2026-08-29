import * as Plot from "@observablehq/plot";
import type { RuntimeResult, BenchResults, DataType } from "@schema-benchmarks/bench";
import type { ErrorType } from "@schema-benchmarks/schemas";
import { formatDuration, shortNumFormatter, uniqueBy } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { errorTypeProps, optimizeTypeProps } from "#src/routes/_benchmarks/_runtime/-constants";
import { getBenchResults } from "#src/routes/_benchmarks/_runtime/-query";
import { Checkbox, ControlLabel } from "#src/shared/components/checkbox";
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

type BenchResult = Exclude<RuntimeResult, { type: "codec" }>;

const getOptimizations = (d: BenchResult) => optimizeTypeProps.labels[d.optimizeType].label;

const getErrorHandling = (d: BenchResult) =>
  d.errorType ? errorTypeProps.labels[d.errorType].label : undefined;

const getBehavior = (d: BenchResult) => {
  const behaviors = [d.throws && "Throws", d.sameObj && "Returns the same object"].filter(
    (behavior) => behavior !== false && behavior !== undefined,
  );
  return behaviors.length > 0 ? behaviors.join(", ") : undefined;
};

export const BaseBenchPlot = createPlotComponent(function useBenchPlot({
  data,
}: {
  data: Array<BenchResult>;
}) {
  const [showAllVariants, setShowAllVariants] = useState(false);
  const formatNumber = useNumberFormatter(shortNumFormatter);

  // When collapsed, show only the best variant per library
  const collapsedData = useMemo(() => uniqueBy(data, (d) => d.libraryName), [data]);
  const displayData = showAllVariants ? data : collapsedData;
  const isCheckboxDisabled = data.length === collapsedData.length;

  // Every benchmark variant for a library is shown, not just the first one.
  const libraries = useMemo(() => uniqueBy(displayData, (d) => d.libraryName), [displayData]);
  const [domRect, ref] = useElementSize();
  const { height, marginLeft } = useMemo(() => {
    const longestLabel = libraries.reduce((a, b) =>
      a.libraryName.length > b.libraryName.length ? a : b,
    );
    return {
      height: Math.max(176, libraries.length * 28 + 52),
      marginLeft: Math.max(84, longestLabel.libraryName.length * 7 + 24),
    };
  }, [libraries]);
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
          Plot.dotX(displayData, {
            x: "mean",
            y: { value: "libraryName", label: "Library" },
            fill: "mean",
            r: 5,
            symbol: "diamond2",
            sort: { y: "x", reduce: "min" },
            channels: {
              Note: (d: BenchResult) => d.note,
              Optimizations: getOptimizations,
              "Error handling": getErrorHandling,
              Behavior: getBehavior,
            },
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
    [displayData, height, marginLeft, domRect?.width, formatNumber],
  );

  const controls = (
    <ControlLabel>
      <Checkbox
        asLabel={false}
        checked={showAllVariants}
        onChange={(e) => setShowAllVariants(e.currentTarget.checked)}
        disabled={isCheckboxDisabled}
      />
      Show all variants
    </ControlLabel>
  );

  return { plot, ref, controls };
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
