import * as Plot from "@observablehq/plot";
import type { DownloadResult } from "@schema-benchmarks/bench";
import downloadResults from "@schema-benchmarks/bench/download.json";
import { formatBytes } from "@schema-benchmarks/utils";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { colorScale } from "@/data/scale";
import { PlotContainer } from ".";

const meta = {
  title: "Components/PlotContainer",
  component: PlotContainer,
  render: (args) => (
    <div className="card" style={{ padding: "1rem" }}>
      <PlotContainer {...args} />
    </div>
  ),
  args: {
    plot: Plot.plot({
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
        range: colorScale,
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
  },
} satisfies Meta<typeof PlotContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
