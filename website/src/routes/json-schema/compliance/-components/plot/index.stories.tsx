import jsonSchemaResults from "@schema-benchmarks/bench/json-schema.json";

import preview from "#storybook/preview";

import { BaseCompliancePlot } from ".";

const meta = preview.meta({
  title: "Features/JsonSchema/Compliance/Plot",
  component: BaseCompliancePlot,
});

export const Validation = meta.story({
  args: {
    data: jsonSchemaResults.compliance.validation?.["draft2020-12"] ?? [],
  },
});
