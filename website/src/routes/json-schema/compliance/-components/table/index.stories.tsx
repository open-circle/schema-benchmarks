import jsonSchemaResults from "@schema-benchmarks/bench/json-schema.json";

import preview from "#storybook/preview";

import { ComplianceTable } from ".";

const results = jsonSchemaResults.compliance.validation?.["draft2020-12"] ?? [];

const meta = preview.meta({
  title: "Features/JsonSchema/Compliance/Table",
  component: ComplianceTable,
  args: {
    results,
    sortBy: "compliance",
    sortDir: "descending",
  } as const,
});

export default meta;

export const Default = meta.story();
