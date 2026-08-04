import jsonSchemaResults from "@schema-benchmarks/bench/json-schema.json";

import { Bar } from "#src/shared/components/table/bar";
import preview from "#storybook/preview";

import "#src/routes/_benchmarks/json-schema/_conversion/to-json/-components/table/index.css";
import { FromJsonTable } from ".";

const meta = preview.meta({
  title: "Features/Benchmark/JsonSchema/Conversion/FromJson/Table",
  component: FromJsonTable,
  args: {
    sortBy: "mean",
    sortDir: "ascending",
  } as const,
});

export const Default = meta.story({
  args: {
    results: jsonSchemaResults.conversion.fromJson,
    meanScaler: Bar.getScale(
      jsonSchemaResults.conversion.fromJson.map((r) => r.mean),
      { lowerBetter: true },
    ),
  },
});
