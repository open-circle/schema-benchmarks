import * as Plot from "@observablehq/plot";
import type { DownloadResult, MinifyType } from "@schema-benchmarks/bench";
import { formatBytes, uniqueBy } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { getDownloadResults } from "#src/routes/_benchmarks/download/-query";
import { Checkbox, ControlLabel } from "#src/shared/components/checkbox";
import { createPlotComponent } from "#src/shared/components/plot";
import { color } from "#src/shared/data/scale";
import { useElementSize } from "#src/shared/hooks/use-content-box-size";

export const BaseDownloadPlot = createPlotComponent(function useDownloadPlot({
  data,
}: {
  data: Array<DownloadResult>;
}) {
  const [showAllVariants, setShowAllVariants] = useState(false);

  // When collapsed, show only the best variant per library
  const collapsedData = useMemo(() => uniqueBy(data, (d) => d.libraryName), [data]);
  const displayData = showAllVariants ? data : collapsedData;
  const isCheckboxDisabled = data.length === collapsedData.length;

  // Every download benchmark variant for a library is shown, not just the first one.
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
          label: "Size (gzipped)",
          tickFormat: (bytes: number) => formatBytes(bytes, { maximumFractionDigits: 0 }),
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
            x: "gzipBytes",
            y: { value: "libraryName", label: "Library" },
            fill: "gzipBytes",
            r: 5,
            symbol: "diamond2",
            sort: { y: "x", reduce: "min" },
            channels: {
              Note: (d: DownloadResult) => d.note,
            },
            tip: {
              pointer: "y",
              className: "plot__tooltip",
              pathFilter: "",
              format: {
                x: (bytes: number) => formatBytes(bytes, { maximumFractionDigits: 0 }),
                y: (d: string) => d,
                fill: false,
              },
            },
          }),
        ],
      }),
    [displayData, domRect?.width, height, marginLeft],
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

BaseDownloadPlot.displayName = "BaseDownloadPlot";

export function DownloadPlot({ minify }: { minify: MinifyType }) {
  const { data } = useSuspenseQuery({
    ...getDownloadResults(),
    select: (results) => results[minify],
  });
  return <BaseDownloadPlot data={data} />;
}
