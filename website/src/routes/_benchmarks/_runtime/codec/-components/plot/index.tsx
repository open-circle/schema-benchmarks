import * as Plot from "@observablehq/plot";
import type { CodecResult } from "@schema-benchmarks/bench";
import {
  durationFormatter,
  getDuration,
  shortNumFormatter,
  uniqueBy,
} from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { getBenchResults } from "#src/routes/_benchmarks/_runtime/-query";
import { Checkbox, ControlLabel } from "#src/shared/components/checkbox";
import { createPlotComponent } from "#src/shared/components/plot";
import { useNumberFormatter } from "#src/shared/hooks/format/use-number-formatter";
import { useElementSize } from "#src/shared/hooks/use-content-box-size";

const getBehavior = (d: CodecResult) => (d.acceptsUnknown ? "Accepts unknown input" : undefined);

export const BaseCodecPlot = createPlotComponent(function useBenchPlot({
  data,
}: {
  data: Array<CodecResult>;
}) {
  const [showAllVariants, setShowAllVariants] = useState(false);
  const formatNumber = useNumberFormatter(shortNumFormatter);

  // When collapsed, show only the best variant per library
  const collapsedData = useMemo(() => uniqueBy(data, (d) => d.libraryName), [data]);
  const displayData = showAllVariants ? data : collapsedData;
  const isCheckboxDisabled = data.length === collapsedData.length;

  // Every codec benchmark variant for a library is shown, not just the first one.
  const points = useMemo(
    () =>
      displayData.flatMap((result) => [
        {
          library: result.libraryName,
          operation: "Encode",
          mean: result.encode.mean,
          note: result.note,
          behavior: getBehavior(result),
        },
        {
          library: result.libraryName,
          operation: "Decode",
          mean: result.decode.mean,
          note: result.note,
          behavior: getBehavior(result),
        },
      ]),
    [displayData],
  );
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
          tickFormat: (d: number) => durationFormatter.format(getDuration(d)),
          nice: true,
        },
        y: {
          label: "Library",
          tickSize: 0,
        },
        color: {
          domain: ["Encode", "Decode"],
          range: ["var(--link)", "var(--button)"],
        },
        marks: [
          Plot.ruleX([0]),
          Plot.dotX(points, {
            x: "mean",
            y: { value: "library", label: "Library" },
            fill: { value: "operation", label: "Operation" },
            r: 5,
            symbol: "diamond2",
            sort: { y: "x", reduce: "min" },
            channels: {
              Note: (d: (typeof points)[number]) => d.note,
              Behavior: (d: (typeof points)[number]) => d.behavior,
            },
            tip: {
              pointer: "xy",
              className: "plot__tooltip",
              pathFilter: "",
              format: {
                x: (d: number) =>
                  `${formatNumber(d)} ms (${durationFormatter.format(getDuration(d, 2))})`,
                y: (d: string) => d,
                fill: (d: string) => d,
              },
            },
          }),
        ],
      }),
    [domRect?.width, formatNumber, height, marginLeft, points],
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

BaseCodecPlot.displayName = "BaseCodecPlot";

export function CodecPlot() {
  const { data } = useSuspenseQuery({
    ...getBenchResults(),
    select: (results) => results.codec,
  });
  return <BaseCodecPlot data={data} />;
}
