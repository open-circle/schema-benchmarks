import jsonSchemaResults from "@schema-benchmarks/bench/json-schema.json";

import { Bar } from "#src/shared/components/table/bar";
import preview from "#storybook/preview";

import "./index.css";
import { JsonSchemaCard } from ".";

const meta = preview.meta({
  title: "Features/Benchmark/JsonSchema/Card",
  component: JsonSchemaCard,
});

export const JsonSchema = meta.story({
  args: {
    result: jsonSchemaResults.bench[0]!,
    meanScaler: Bar.getScale(
      jsonSchemaResults.bench.map((r) => r.mean),
      { lowerBetter: true },
    ),
  },
});
