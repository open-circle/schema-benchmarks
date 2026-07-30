import benchResults from "@schema-benchmarks/bench/bench.json";

import { Bar } from "#src/shared/components/table/bar";
import preview from "#storybook/preview";

import "./table.css";
import { JsonSchemaTable } from "./table";

const meta = preview.meta({
  title: "Features/Benchmark/JsonSchema/Table",
  component: JsonSchemaTable,
  args: {
    sortBy: "mean",
    sortDir: "ascending",
    to: "/json-schema",
  } as const,
});

export const JsonSchema = meta.story({
  args: {
    results: benchResults.jsonSchema,
    meanScaler: Bar.getScale(
      benchResults.jsonSchema.map((r) => r.mean),
      { lowerBetter: true },
    ),
  },
});
