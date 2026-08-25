import benchResults from "@schema-benchmarks/bench/bench.json";

import preview from "#storybook/preview";

import { BaseCodecPlot } from "./index.js";

const meta = preview.meta({
  title: "Features/Benchmark/Runtime/Codec/Plot",
  component: BaseCodecPlot,
});

export const Default = meta.story({
  args: {
    data: benchResults.codec,
  },
});
