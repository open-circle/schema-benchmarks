import benchResults from "@schema-benchmarks/bench/bench.json";
import preview from "../../../../../.storybook/preview";
import { BenchTable } from "./index.js";

const meta = preview.meta({
  title: "Features/Benchmark/Table",
  component: BenchTable,
  args: {
    results: benchResults.validation.invalid,
  },
});

export const Default = meta.story();
