import benchResults from "@schema-benchmarks/bench/bench.json";

import preview from "#storybook/preview";

import { BaseBenchPlot } from "./index.js";

const meta = preview.meta({
  title: "Features/Benchmark/Runtime/Plot",
  component: BaseBenchPlot,
});

export const Initialization = meta.story({
  args: {
    data: benchResults.initialization,
  },
});

export const Validation = meta.story({
  args: {
    data: benchResults.validation.valid,
  },
});

export const Parsing = meta.story({
  args: {
    data: benchResults.parsing.valid,
  },
});

export const Standard = meta.story({
  args: {
    data: benchResults.standard.valid,
  },
});
