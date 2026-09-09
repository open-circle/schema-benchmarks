import { parseArgs } from "node:util";

import { getTargetCompliance } from "@schema-benchmarks/json-schema-tests";
import { complianceTargetSchema } from "@schema-benchmarks/json-schema-tests/types";
import type { SourceConfig } from "@schema-benchmarks/schemas";
import { complianceTypeSchema } from "@schema-benchmarks/schemas";
import { libraries } from "@schema-benchmarks/schemas/libraries";
import { ensureArray } from "@schema-benchmarks/utils";
import * as Schema from "typebox/schema";

import type { JsonSchemaSourceResult } from "#src/results/types.ts";
import { getEmptyJsonComplianceResults, getEmptyJsonSchemaResults } from "#src/results/types.ts";

const {
  values: { lib },
} = parseArgs({
  options: {
    lib: {
      type: "string",
      short: "l",
    },
  },
});

if (!lib || !libraries[lib]) {
  throw new Error(`Library not found: ${lib}`);
}

const libraryConfig = await libraries[lib]();

const results = getEmptyJsonSchemaResults();

const { library, jsonSchema: jsonSchemaConfig } = libraryConfig;
const { name: libraryName, version } = library;

if (!jsonSchemaConfig?.compliance) {
  console.log(JSON.stringify(results));
  process.exit(0);
}

function jsonSourceToResult(source: SourceConfig): JsonSchemaSourceResult {
  if (source.type === "package") {
    return {
      type: source.type,
      package: source.package,
    };
  }
  return source.type;
}

console.log(`\nChecking JSON schema compliance: ${libraryName}`);

for (const complianceType of complianceTypeSchema.options) {
  for (const complianceTarget of complianceTargetSchema.options) {
    if (complianceType === "roundtrip") {
      for (const benchConfig of ensureArray(jsonSchemaConfig.compliance[complianceType] ?? [])) {
        const { run, snippet, note, source } = benchConfig;
        const complianceResults = await getTargetCompliance(
          complianceTarget,
          async (schema, data, context) => {
            const roundtripped = await run(schema, context);
            // typebox consistently tests highest for validation compliance
            // so using it introduces the smallest margin of error
            return Schema.Check(roundtripped, data);
          },
        );
        if (complianceResults.count.passed === 0) continue;
        ((results.compliance[complianceType] ??= getEmptyJsonComplianceResults())[
          complianceTarget
        ] ??= []).push({
          id: crypto.randomUUID(),
          libraryName,
          version,
          snippet: snippet(complianceTarget),
          note,
          source: jsonSourceToResult(source),
          results: complianceResults,
        });
      }
    } else {
      for (const benchConfig of ensureArray(jsonSchemaConfig.compliance[complianceType] ?? [])) {
        const { run, snippet, note, source } = benchConfig;
        const complianceResults = await getTargetCompliance(complianceTarget, run);
        if (complianceResults.count.passed === 0) continue;
        ((results.compliance[complianceType] ??= getEmptyJsonComplianceResults())[
          complianceTarget
        ] ??= []).push({
          id: crypto.randomUUID(),
          libraryName,
          version,
          snippet: snippet(complianceTarget),
          note,
          source: jsonSourceToResult(source),
          results: complianceResults,
        });
      }
    }
  }
}

console.log(JSON.stringify(results));
