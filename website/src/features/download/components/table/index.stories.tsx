import downloadResults from "@schema-benchmarks/bench/download.json";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DownloadTable } from "./index.js";

const meta = {
  title: "Components/Download Table",
  component: DownloadTable,
  args: {
    results: downloadResults.minified,
    mbps: 20,
    minify: "minified",
  },
} satisfies Meta<typeof DownloadTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
