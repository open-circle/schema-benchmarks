import benchResults from "@schema-benchmarks/bench/bench.json";

import { Bar } from "#src/shared/components/table/bar";
import preview from "#storybook/preview";

import "#src/routes/_benchmarks/json-schema/-components/card.css";
import { JsonSchemaCard } from "./card";

const meta = preview.meta({
  title: "Features/Benchmark/JsonSchema/Card",
  component: JsonSchemaCard,
});

export const JsonSchema = meta.story({
  args: {
    result: benchResults.jsonSchema[0]!,
    meanScaler: Bar.getScale(
      benchResults.jsonSchema.map((r) => r.mean),
      { lowerBetter: true },
    ),
  },
});
