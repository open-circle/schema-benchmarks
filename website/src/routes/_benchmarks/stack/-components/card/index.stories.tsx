import stackResults from "@schema-benchmarks/bench/stack.json";
import { Bar } from "#/shared/components/table/bar.js";
import preview from "#storybook/preview";
import { StackCard } from "./index.js";
import "./index.css";

const meta = preview.meta({
  title: "Features/Benchmark/Stack/Card",
  component: StackCard,
});

export const Default = meta.story({
  args: {
    // biome-ignore lint/style/noNonNullAssertion: demo data
    result: stackResults.at(3)!,
    barScale: Bar.getScale(
      stackResults.filter((r) => typeof r.line === "number").map((r) => r.line),
      { lowerBetter: true },
    ),
  },
});
