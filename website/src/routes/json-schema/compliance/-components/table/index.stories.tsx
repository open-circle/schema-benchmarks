import jsonSchemaResults from "@schema-benchmarks/bench/json-schema.json";

import { Pie } from "#src/shared/components/table/pie.tsx";
import preview from "#storybook/preview";

import { ComplianceTable } from ".";

const results = jsonSchemaResults.compliance.validation?.["draft2019-09"] ?? [];
const pieScale = Pie.getScale(
  results.map((result) => {
    const { passed, failed } = result.results.count;
    const total = passed + failed;
    return total > 0 ? (passed / total) * 100 : 0;
  }),
);

const meta = preview.meta({
  title: "Features/JsonSchema/Compliance/Table",
  component: ComplianceTable,
  args: {
    results,
    sortBy: "libraryName",
    sortDir: "ascending",
    pieScale,
  } as const,
});

export default meta;

export const Default = meta.story();
