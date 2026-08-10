import jsonSchemaResults from "@schema-benchmarks/bench/json-schema.json";

import { Bar } from "#src/shared/components/table/bar";
import preview from "#storybook/preview";

import "./index.css";
import { ToJsonTable } from ".";

const meta = preview.meta({
  title: "Features/JsonSchema/Conversion/ToJson/Table",
  component: ToJsonTable,
  args: {
    sortBy: "mean",
    sortDir: "ascending",
  } as const,
});

export const Default = meta.story({
  args: {
    results: jsonSchemaResults.conversion.toJson,
    meanScaler: Bar.getScale(
      jsonSchemaResults.conversion.toJson.map((r) => r.mean),
      { lowerBetter: true },
    ),
  },
});
