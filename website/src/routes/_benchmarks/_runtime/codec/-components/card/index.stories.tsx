import benchResults from "@schema-benchmarks/bench/bench.json";

import { Bar } from "#/shared/components/table/bar";
import preview from "#storybook/preview";

import { CodecCard } from "./index.js";

const meta = preview.meta({
  title: "Features/Benchmark/Runtime/Codec/Card",
  component: CodecCard,
});

export const Default = meta.story({
  args: {
    result: benchResults.codec[0]!,
    encodeScaler: Bar.getScale(
      benchResults.codec.map((r) => r.encode.mean),
      { lowerBetter: true },
    ),
    decodeScaler: Bar.getScale(
      benchResults.codec.map((r) => r.decode.mean),
      { lowerBetter: true },
    ),
  },
});
