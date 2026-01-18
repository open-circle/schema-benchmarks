import * as Plot from "@observablehq/plot";
import type { DownloadResult, MinifyType } from "@schema-benchmarks/bench";
import { formatBytes, uniqueBy } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { createPlotComponent } from "@/components/plot";
import { color } from "@/data/scale";
import { useElementSize } from "@/hooks/use-content-box-size";
import { getDownloadResults } from "../../query";

const getLibraryName = (d: DownloadResult) => {
  const [libraryName] = d.libraryName.split(" (");
  return libraryName;
};

const intFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
});

export const DownloadPlot = createPlotComponent(function useDownloadPlot({
  minify,
}: {
  minify: MinifyType;
}) {
  const { data } = useSuspenseQuery({
    ...getDownloadResults(),
    select: (results) => results[minify],
  });
  const values = useMemo(() => uniqueBy(data, getLibraryName), [data]);
  const [domRect, ref] = useElementSize();
  const plot = useMemo(
    () =>
      Plot.plot({
        marginLeft: 48,
        width: domRect?.width,
        y: {
          grid: true,
          label: "Size",
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
            x: (d: DownloadResult) =>
              d.libraryName + (d.note ? ` (${d.note})` : ""),
            y: "bytes",
            fill: "bytes",
            sort: { x: "y" },
          }),
        ],
      }),
    [values, domRect?.width],
  );
  return { plot, ref };
});

DownloadPlot.displayName = "DownloadPlot";
