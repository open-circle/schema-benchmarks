import * as Plot from "@observablehq/plot";
import type { DownloadResult } from "@schema-benchmarks/bench";
import downloadResults from "@schema-benchmarks/bench/download.json";
import { formatBytes } from "@schema-benchmarks/utils";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo } from "react";
import { color } from "@/shared/data/scale";
import { createPlotComponent } from ".";

const PlotComponent = createPlotComponent(function usePlotContainer() {
  return {
    plot: useMemo(
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
            Plot.barY(downloadResults.minified, {
              x: (d: DownloadResult) =>
                `${d.libraryName}${d.note ? ` (${d.note})` : ""}`,
              y: "bytes",
              fill: "bytes",
              sort: { x: "y" },
            }),
          ],
        }),
      [],
    ),
  };
});

const meta = {
  title: "Components/createPlotComponent",
  component: PlotComponent,
  render: () => (
    <div className="card" style={{ padding: "1rem" }}>
      <PlotComponent />
    </div>
  ),
} satisfies Meta<typeof PlotComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
