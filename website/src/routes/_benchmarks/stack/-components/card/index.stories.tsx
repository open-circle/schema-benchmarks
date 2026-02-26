import stackResults from "@schema-benchmarks/bench/stack.json";

import { Bar } from "#/shared/components/table/bar.js";
import preview from "#storybook/preview";

import { StackCard } from "./index.js";

import "./index.css";

const meta = preview
  .type<{ args: { resultIdx: number; barScale: ReturnType<typeof Bar.getScale> } }>()
  .meta({
    title: "Features/Benchmark/Stack/Card",
    render: ({ resultIdx, barScale }) => (
      <StackCard result={stackResults[resultIdx]!} barScale={barScale} />
    ),
    args: {
      resultIdx: 0,
      barScale: Bar.getScale(
        stackResults.filter((r) => typeof r.line === "number").map((r) => r.line),
        { lowerBetter: true },
      ),
    } as const,
    argTypes: {
      resultIdx: {
        control: {
          type: "range",
          min: 0,
          max: stackResults.length - 1,
        },
      },
    },
    parameters: {
      layout: "padded",
    },
  });

export const Default = meta.story();
