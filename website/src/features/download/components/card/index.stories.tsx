import downloadResults from "@schema-benchmarks/bench/download.json";
import { Bar } from "#/shared/components/table/bar";
import preview from "#storybook/preview";
import { DownloadCard } from ".";
import "./index.css";

const meta = preview.meta({
  title: "Features/Download/Card",
  component: DownloadCard,
});

export const Default = meta.story({
  args: {
    // biome-ignore lint/style/noNonNullAssertion: demo data
    result: downloadResults.minified[0]!,
    mbps: 32,
    minify: "minified",
    gzipScaler: Bar.getScale(
      downloadResults.minified.map((r) => r.gzipBytes),
      { lowerBetter: true },
    ),
  },
});
