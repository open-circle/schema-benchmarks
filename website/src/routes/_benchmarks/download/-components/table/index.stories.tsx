import downloadResults from "@schema-benchmarks/bench/download.json";

import { Bar } from "#/shared/components/table/bar.js";
import preview from "#storybook/preview";

import { DownloadTable } from "./index.js";

const meta = preview.meta({
  title: "Features/Benchmark/Download/Table",
  component: DownloadTable,
  args: {
    results: downloadResults.minified,
    gzipScaler: Bar.getScale(
      downloadResults.minified.map((r) => r.gzipBytes),
      { lowerBetter: true },
    ),
    mbps: 32,
    minify: "minified",
    sortBy: "gzipBytes",
    sortDir: "ascending",
  } as const,
});

export const Default = meta.story();
