import jsonSchemaResults from "@schema-benchmarks/bench/json-schema.json";

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
    to: "/json-schema/conversion",
  } as const,
});

export const JsonSchema = meta.story({
  args: {
    results: jsonSchemaResults.bench,
    meanScaler: Bar.getScale(
      jsonSchemaResults.bench.map((r) => r.mean),
      { lowerBetter: true },
    ),
  },
});
