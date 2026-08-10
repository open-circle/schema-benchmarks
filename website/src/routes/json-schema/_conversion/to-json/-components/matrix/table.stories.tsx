import jsonSchemaResults from "@schema-benchmarks/bench/json-schema.json";

import preview from "#storybook/preview";

import { MatrixTable } from "./table";

const meta = preview.meta({
  title: "Features/JsonSchema/Conversion/ToJson/Matrix/Table",
  component: MatrixTable,
  args: {
    matrix: jsonSchemaResults.conversion.toJsonSupport,
  },
});

export const Default = meta.story({});
