import jsonSchemaResults from "@schema-benchmarks/bench/json-schema.json";

import { Bar } from "#src/shared/components/table/bar";
import preview from "#storybook/preview";

import { FromJsonCard } from ".";

const meta = preview.meta({
  title: "Features/Benchmark/JsonSchema/Conversion/FromJson/Card",
  component: FromJsonCard,
});

export const Default = meta.story({
  args: {
    result: jsonSchemaResults.conversion.fromJson[0]!,
    meanScaler: Bar.getScale(
      jsonSchemaResults.conversion.fromJson.map((r) => r.mean),
      { lowerBetter: true },
    ),
  },
});
