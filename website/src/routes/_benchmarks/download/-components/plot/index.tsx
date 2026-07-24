import * as Plot from "@observablehq/plot";
import type { DownloadResult, MinifyType } from "@schema-benchmarks/bench";
import { formatBytes, uniqueBy } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { getDownloadResults } from "#src/routes/_benchmarks/download/-query";
import { createPlotComponent } from "#src/shared/components/plot";
import { color } from "#src/shared/data/scale";
import { useElementSize } from "#src/shared/hooks/use-content-box-size";

const getLabel = (d: DownloadResult) => d.libraryName;

const intFormatter = new Intl.NumberFormat("en", {
  maximumFractionDigits: 0,
});

export const BaseDownloadPlot = createPlotComponent(function useDownloadPlot({
  data,
}: {
  data: Array<DownloadResult>;
}) {
  const values = useMemo(() => uniqueBy(data, getLabel), [data]);
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
        x: {
          label: "Library",
        },
        y: {
          grid: true,
          label: "Size (gzipped)",
          tickFormat: (bytes: number) => formatBytes(bytes, intFormatter),
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
            y: "gzipBytes",
            fill: "gzipBytes",
            sort: { x: "y" },
            tip: {
              pointer: "x",
              className: "plot__tooltip",
              pathFilter: "",
              format: {
                y: (bytes: number) => formatBytes(bytes, intFormatter),
                fill: false,
              },
            },
          }),
        ],
      }),
    [values, domRect?.width, minWidth],
  );
  return { plot, ref, minWidth };
});

BaseDownloadPlot.displayName = "BaseDownloadPlot";

export function DownloadPlot({ minify }: { minify: MinifyType }) {
  const { data } = useSuspenseQuery({
    ...getDownloadResults(),
    select: (results) => results[minify],
  });
  return <BaseDownloadPlot data={data} />;
}
