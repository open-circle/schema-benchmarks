import downloadResults from "@schema-benchmarks/bench/download.json";
import preview from "../../../../../.storybook/preview";
import { DownloadTable } from "./index.js";

const meta = preview.meta({
  title: "Features/Download/Table",
  component: DownloadTable,
  args: {
    results: downloadResults.minified,
    mbps: 32,
    minify: "minified",
  } as const,
});

export const Default = meta.story();
