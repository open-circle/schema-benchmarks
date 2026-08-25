import downloadResults from "@schema-benchmarks/bench/download.json";

import { Bar } from "#src/shared/components/table/bar";
import preview from "#storybook/preview";

import { DownloadList } from ".";

import "./index.css";

const meta = preview.meta({
  title: "Features/Benchmark/Download/List",
  component: DownloadList,
});

export const Default = meta.story({
  args: {
    results: downloadResults.minified,
    mbps: 32,
    minify: "minified",
    gzipScaler: Bar.getScale(
      downloadResults.minified.map((r) => r.gzipBytes),
      { lowerBetter: true },
    ),
  },
});
