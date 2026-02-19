import * as Plot from "@observablehq/plot";
import type { DownloadResult, MinifyType } from "@schema-benchmarks/bench";
import { formatBytes, uniqueBy } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { formatLibraryName } from "#/routes/_benchmarks/-lib";
import { createPlotComponent } from "#/shared/components/plot";
import { color } from "#/shared/data/scale";
import { useElementSize } from "#/shared/hooks/use-content-box-size";

import { getDownloadResults } from "../../-query";

const getLabel = (d: DownloadResult) => formatLibraryName(d.libraryName);

const intFormatter = new Intl.NumberFormat(undefined, {
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
        y: {
          grid: true,
          label: "Size (gzipped)",
          tickFormat: (bytes: number) => formatBytes(bytes, intFormatter),
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
