import * as Plot from "@observablehq/plot";
import type { DownloadResult, MinifyType } from "@schema-benchmarks/bench";
import { formatBytes, uniqueBy } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { getDownloadResults } from "#src/routes/_benchmarks/download/-query";
import { createPlotComponent } from "#src/shared/components/plot";
import { color } from "#src/shared/data/scale";
import { useElementSize } from "#src/shared/hooks/use-content-box-size";

export const BaseDownloadPlot = createPlotComponent(function useDownloadPlot({
  data,
}: {
  data: Array<DownloadResult>;
}) {
  // Every download benchmark variant for a library is shown, not just the first one.
  const libraries = useMemo(() => uniqueBy(data, (d) => d.libraryName), [data]);
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
          Plot.dotX(data, {
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
    [data, domRect?.width, height, marginLeft],
  );
  return { plot, ref };
});

BaseDownloadPlot.displayName = "BaseDownloadPlot";

export function DownloadPlot({ minify }: { minify: MinifyType }) {
  const { data } = useSuspenseQuery({
    ...getDownloadResults(),
    select: (results) => results[minify],
  });
  return <BaseDownloadPlot data={data} />;
}
