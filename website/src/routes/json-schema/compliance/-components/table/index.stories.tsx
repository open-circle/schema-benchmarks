import jsonSchemaResults from "@schema-benchmarks/bench/json-schema.json";

import { getPctCompliance } from "#src/routes/json-schema/compliance/-constants.tsx";
import { Pie } from "#src/shared/components/table/pie.tsx";
import preview from "#storybook/preview";

import { ComplianceTable } from ".";

const results = jsonSchemaResults.compliance.validation?.["draft2020-12"] ?? [];
const pieScale = Pie.getScale(results.map(getPctCompliance), { max: 1 });

const meta = preview.meta({
  title: "Features/JsonSchema/Compliance/Table",
  component: ComplianceTable,
  args: {
    results,
    sortBy: "compliance",
    sortDir: "descending",
    pieScale,
  } as const,
});

export default meta;

export const Default = meta.story();
