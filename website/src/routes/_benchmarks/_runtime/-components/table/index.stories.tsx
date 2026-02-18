import benchResults from "@schema-benchmarks/bench/bench.json";

import { Bar } from "#/shared/components/table/bar";
import preview from "#storybook/preview";

import { BenchTable } from "./index.js";

const meta = preview.meta({
  title: "Features/Benchmark/Runtime/Table",
  component: BenchTable,
  args: {
    results: benchResults.validation.invalid,
    meanScaler: Bar.getScale(
      benchResults.validation.invalid.map((r) => r.mean),
      { lowerBetter: true },
    ),
    to: "/validation",
    sortBy: "mean",
    sortDir: "ascending",
  } as const,
});

export const Default = meta.story();
