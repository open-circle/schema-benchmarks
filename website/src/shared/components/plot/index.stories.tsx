import downloadResults from "@schema-benchmarks/bench/download.json";

import { BaseDownloadPlot } from "#src/routes/_benchmarks/download/-components/plot";
import preview from "#storybook/preview";

const meta = preview.meta({
  title: "Components/Plot",
  component: BaseDownloadPlot,
});

export const Default = meta.story({
  args: { data: downloadResults.minified, minify: "minified" },
});
