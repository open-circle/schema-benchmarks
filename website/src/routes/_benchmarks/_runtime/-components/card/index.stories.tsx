import benchResults from "@schema-benchmarks/bench/bench.json";

import { Bar } from "#/shared/components/table/bar";
import preview from "#storybook/preview";

import "./index.css";
import { BenchCard } from ".";

const meta = preview.meta({
  title: "Features/Benchmark/Runtime/Card",
  component: BenchCard,
});

export const Initialization = meta.story({
  args: {
    result: benchResults.initialization[0]!,
    barScale: Bar.getScale(
      benchResults.initialization.map((r) => r.mean),
      { lowerBetter: true },
    ),
  },
});

export const Validation = meta.story({
  args: {
    result: benchResults.validation.valid[0]!,
    barScale: Bar.getScale(
      benchResults.validation.valid.map((r) => r.mean),
      { lowerBetter: true },
    ),
  },
});

export const Parsing = meta.story({
  args: {
    result: benchResults.parsing.valid[0]!,
    barScale: Bar.getScale(
      benchResults.parsing.valid.map((r) => r.mean),
      { lowerBetter: true },
    ),
  },
});
