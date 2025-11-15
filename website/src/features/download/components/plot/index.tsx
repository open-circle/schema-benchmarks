import * as Plot from "@observablehq/plot";
import type { DownloadResult } from "@schema-benchmarks/bench";
import { formatBytes } from "@schema-benchmarks/utils";
import { useMemo } from "react";
import { PlotContainer } from "@/components/plot";
import { colorScale } from "@/data/scale";

export interface DownloadPlotProps {
  results: Array<DownloadResult>;
}

const formatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
});

export function DownloadPlot({ results }: DownloadPlotProps) {
  const plot = useMemo(
    () =>
      Plot.plot({
        marginLeft: 48,
        marginBottom: 64,
        x: {
          tickRotate: -45,
        },
        y: {
          grid: true,
          label: "Size",
          tickFormat: (bytes: number) => formatBytes(bytes, formatter),
        },
        color: {
          type: "quantize",
          reverse: true,
          range: colorScale,
        },
        marks: [
          Plot.ruleY([0]),
          Plot.barY(results, {
            x: (d: DownloadResult) =>
              `${d.libraryName}${d.note ? ` (${d.note})` : ""}`,
            y: "bytes",
            fill: "bytes",
            sort: { x: "y" },
          }),
        ],
      }),
    [results],
  );
  return (
    <div className="card">
      <PlotContainer plot={plot} />
    </div>
  );
}
