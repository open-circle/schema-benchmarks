import * as child_process from "node:child_process";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { promisify } from "node:util";

import { complianceTargetSchema } from "@schema-benchmarks/json-schema-tests/types";
import { complianceTypeSchema } from "@schema-benchmarks/schemas";
import { libraries } from "@schema-benchmarks/schemas/libraries";
import { forwardStd, getSigintSignal } from "@schema-benchmarks/utils/node";
import * as v from "valibot";

import {
  getEmptyJsonComplianceResults,
  getEmptyJsonSchemaResults,
  jsonSchemaBenchResultsSchema,
} from "#src/results/types.ts";

const sigintSignal = getSigintSignal();

const execFile = promisify(child_process.execFile);

const allResults = [];

for (const lib of Object.keys(libraries)) {
  const libResult = await forwardStd(
    execFile(
      process.execPath,
      [path.resolve(process.cwd(), "./src/scripts/json-schema/library.ts"), `--lib=${lib}`],
      { signal: sigintSignal },
    ),
  );
  const results = libResult.stdout.split("\n").slice(-3).findLast(Boolean);
  if (!results) throw new Error(`No results for ${lib}`);
  allResults.push(v.parse(jsonSchemaBenchResultsSchema, JSON.parse(results)));
}

const merged = getEmptyJsonSchemaResults();

for (const results of allResults) {
  merged.conversion.toJson.push(...results.conversion.toJson);
  merged.conversion.fromJson.push(...results.conversion.fromJson);
  merged.conversion.toJsonSupport = {
    ...merged.conversion.toJsonSupport,
    ...results.conversion.toJsonSupport,
  };
  for (const complianceType of complianceTypeSchema.options) {
    for (const complianceTarget of complianceTargetSchema.options) {
      const targetResults = results.compliance[complianceType]?.[complianceTarget];
      if (targetResults) {
        ((merged.compliance[complianceType] ??= getEmptyJsonComplianceResults())[
          complianceTarget
        ] ??= []).push(...targetResults);
      }
    }
  }
}

for (const arr of [merged.conversion.toJson, merged.conversion.fromJson]) {
  arr.sort((a, b) => a.mean - b.mean);
}

// sort compliance results by highest pass rate
for (const complianceType of complianceTypeSchema.options) {
  for (const complianceTarget of complianceTargetSchema.options) {
    const targetResults = merged.compliance[complianceType]?.[complianceTarget];
    if (targetResults) {
      targetResults.sort(({ results: a }, { results: b }) => {
        const aPassRate = a.count.passed / (a.count.passed + a.count.failed);
        const bPassRate = b.count.passed / (b.count.passed + b.count.failed);
        return bPassRate - aPassRate;
      });
    }
  }
}

await fs.writeFile(path.resolve(process.cwd(), "./json-schema.json"), JSON.stringify(merged));
