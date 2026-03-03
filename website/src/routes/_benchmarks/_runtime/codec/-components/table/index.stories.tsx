import benchResults from "@schema-benchmarks/bench/bench.json";

import { Bar } from "#/shared/components/table/bar";
import preview from "#storybook/preview";

import { CodecTable } from ".";

const meta = preview.meta({
  title: "Features/Benchmark/Runtime/Codec/Table",
  component: CodecTable,
  args: {
    results: benchResults.codec,
    encodeScaler: Bar.getScale(
      benchResults.codec.map((r) => r.encode.mean),
      { lowerBetter: true },
    ),
    decodeScaler: Bar.getScale(
      benchResults.codec.map((r) => r.decode.mean),
      { lowerBetter: true },
    ),
    sortBy: "encode",
    sortDir: "ascending",
  } as const,
});

export const Default = meta.story();
