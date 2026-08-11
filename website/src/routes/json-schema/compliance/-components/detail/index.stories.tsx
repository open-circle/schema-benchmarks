import jsonSchemaResults from "@schema-benchmarks/bench/json-schema.json";

import preview from "#storybook/preview";

import { ComplianceDetail } from ".";

import "./index.css";

const meta = preview.meta({
  title: "Features/JsonSchema/Compliance/Detail",
  component: ComplianceDetail,
  args: {
    result: jsonSchemaResults.compliance.validation?.["draft2020-12"]?.[0],
    target: "draft2020-12",
  } as const,
});

export default meta;

export const Default = meta.story();
