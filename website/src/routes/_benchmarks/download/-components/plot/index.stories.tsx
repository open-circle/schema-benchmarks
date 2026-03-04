import downloadResults from "@schema-benchmarks/bench/download.json";

import preview from "#storybook/preview";

import { BaseDownloadPlot } from "./index.js";

const meta = preview.meta({
  title: "Features/Benchmark/Download/Plot",
  component: BaseDownloadPlot,
});

export const Default = meta.story({
  args: {
    data: downloadResults.minified,
  },
});
