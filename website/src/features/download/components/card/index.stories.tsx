import downloadResults from "@schema-benchmarks/bench/download.json";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bar } from "@/components/table/bar";
import { DownloadCard } from ".";
import "./index.css";

const meta = {
  title: "Features/Download/Card",
  component: DownloadCard,
} satisfies Meta<typeof DownloadCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    result: downloadResults.minified[0]!,
    mbps: 32,
    minify: "minified",
    gzipScaler: Bar.getScale(
      downloadResults.minified.map((r) => r.gzipBytes),
      { lowerBetter: true },
    ),
  },
};
