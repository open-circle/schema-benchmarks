import * as Plot from "@observablehq/plot";
import downloadResults from "@schema-benchmarks/bench/download.json";
import { formatBytes, uniqueBy } from "@schema-benchmarks/utils";
import { useMemo } from "react";
import { color } from "#/shared/data/scale";
import preview from "#storybook/preview";
import { createPlotComponent } from ".";

const PlotComponent = createPlotComponent(function usePlotContainer() {
  return {
    plot: useMemo(
      () =>
        Plot.plot({
          style: {
            fontFamily: "var(--font-family-body)",
            textTransform: "none",
          },
          marginLeft: 48,
          marginBottom: 64,
          x: {
            tickRotate: -45,
          },
          y: {
            grid: true,
            label: "Size (gzipped)",
            tickFormat: (bytes: number) =>
              formatBytes(
                bytes,
                new Intl.NumberFormat(undefined, {
                  maximumFractionDigits: 0,
                }),
              ),
          },
          color: {
            type: "quantize",
            reverse: true,
            range: color,
          },
          marks: [
            Plot.ruleY([0]),
            Plot.barY(
              uniqueBy(
                downloadResults.minified.toSorted(
                  (a, b) => a.gzipBytes - b.gzipBytes,
                ),
                (d) => d.libraryName,
              ),
              {
                x: (d) => d.libraryName,
                y: "gzipBytes",
                fill: "gzipBytes",
                sort: { x: "y" },
              },
            ),
          ],
        }),
      [],
    ),
  };
});

const meta = preview.meta({
  title: "Components/createPlotComponent",
  component: PlotComponent,
  render: () => (
    <div className="card" style={{ padding: "1rem" }}>
      <PlotComponent />
    </div>
  ),
});

export const Default = meta.story();
