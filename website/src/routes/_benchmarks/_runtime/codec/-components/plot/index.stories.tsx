import benchResults from "@schema-benchmarks/bench/bench.json";

import preview from "#storybook/preview";

import { BaseCodecPlot } from "./index.js";

const meta = preview.meta({
  title: "Features/Benchmark/Runtime/Codec/Plot",
  component: BaseCodecPlot,
  argTypes: {
    encodeDir: {
      control: {
        type: "inline-radio",
      },
      options: ["encode", "decode"],
    },
  },
  args: {
    encodeDir: "encode",
  } as const,
});

export const Default = meta.story({
  args: {
    data: benchResults.codec,
  },
});
