import * as Plot from "@observablehq/plot";
import type { DownloadResult, MinifyType } from "@schema-benchmarks/bench";
import { formatBytes, uniqueBy } from "@schema-benchmarks/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ClientOnly } from "@tanstack/react-router";
import { useMemo } from "react";
import { PlotContainer } from "@/components/plot";
import { color } from "@/data/scale";
import { getDownloadResults } from "../../query";

const getLibraryName = (d: DownloadResult) => {
  const [libraryName] = d.libraryName.split(" (");
  return libraryName;
};

const intFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
});

export function DownloadPlot({ minify }: { minify: MinifyType }) {
  const { data } = useSuspenseQuery({
    ...getDownloadResults(),
    select: (results) => results[minify],
  });
  const values = useMemo(() => uniqueBy(data, getLibraryName), [data]);
  const plot = useMemo(
    () =>
      Plot.plot({
        marginLeft: 48,
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
            x: getLibraryName,
            y: "bytes",
            fill: "bytes",
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
