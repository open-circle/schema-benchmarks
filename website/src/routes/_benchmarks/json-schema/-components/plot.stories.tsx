import benchResults from "@schema-benchmarks/bench/bench.json";

import preview from "#storybook/preview";

import { BaseJsonSchemaPlot } from "./plot";

const meta = preview.meta({
  title: "Features/Benchmark/JsonSchema/Plot",
  component: BaseJsonSchemaPlot,
});

export const JsonSchema = meta.story({
  args: {
    data: benchResults.jsonSchema.filter(
      (result) => result.target === "draft-2020-12" && result.direction === "input",
    ),
  },
});
