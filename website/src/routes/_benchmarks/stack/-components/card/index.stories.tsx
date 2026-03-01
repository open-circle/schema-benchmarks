import stackResults from "@schema-benchmarks/bench/stack.json";
import { exclude, filterMap } from "@schema-benchmarks/utils";

import { Bar } from "#/shared/components/table/bar.js";

import "./index.css";
import preview from "#storybook/preview";

import { StackCard } from "./index.js";

const meta = preview
  .type<{
    args: {
      resultIdx: number;
      frameScale: ReturnType<typeof Bar.getScale>;
      lineCountScale: ReturnType<typeof Bar.getScale>;
    };
  }>()
  .meta({
    title: "Features/Benchmark/Stack/Card",
    render: ({ resultIdx, frameScale, lineCountScale }) => (
      <StackCard result={stackResults[resultIdx]!} {...{ frameScale, lineCountScale }} />
    ),
    args: {
      resultIdx: 0,
      frameScale: Bar.getScale(
        filterMap(stackResults, (r) => (typeof r.frame === "number" ? r.frame : exclude)),
        { lowerBetter: true },
      ),
      lineCountScale: Bar.getScale(
        stackResults.map((r) => r.lineCount),
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
