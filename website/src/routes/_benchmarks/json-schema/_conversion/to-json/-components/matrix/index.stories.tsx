import jsonSchemaResults from "@schema-benchmarks/bench/json-schema.json";

import preview from "#storybook/preview";

import { SupportMatrix } from ".";

const meta = preview.meta({
  title: "Features/Benchmark/JsonSchema/Conversion/ToJson/Matrix",
  component: SupportMatrix,
  args: {
    matrix: jsonSchemaResults.conversion.toJsonSupport,
  },
});

export const Default = meta.story({});
