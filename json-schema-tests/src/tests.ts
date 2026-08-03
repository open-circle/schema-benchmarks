import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { unsafeFromEntries } from "@schema-benchmarks/utils";
import * as v from "valibot";

import { targets } from "./constants.gen.ts";
import type {
  ComplianceTarget,
  ComplianceFn,
  FileComplianceResult,
  ComplianceResults,
} from "./types.ts";
import { testCaseSchema } from "./types.ts";

// oxlint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(new URL(import.meta.url)));

export async function* getTestCases(target: ComplianceTarget) {
  const testCasesDir = path.join(__dirname, "../tests", target);
  const testCaseFiles = fs.readdirSync(testCasesDir).filter((file) => file.endsWith(".json"));
  for (const file of testCaseFiles) {
    yield [
      path.basename(file, ".json"),
      v.parse(
        v.array(testCaseSchema),
        await import(`#tests/${target}/${file}`, { with: { type: "json" } }).then((m) => m.default),
      ),
    ] as const;
  }
}

export async function getTargetCompliance(
  target: ComplianceTarget,
  complianceFn: ComplianceFn,
): Promise<ComplianceResults> {
  const results: ComplianceResults = {
    count: {
      passed: 0,
      failed: 0,
    },
    files: {},
  };

  for await (const [file, testCases] of getTestCases(target)) {
    const result: FileComplianceResult = {
      description: file,
      count: {
        passed: 0,
        failed: 0,
      },
      failedTests: [],
    };
    results.files[file] = result;
    for (const { description, schema, tests } of testCases) {
      for (const { description: testDescription, data, valid: expected } of tests) {
        try {
          const received = await complianceFn(schema, data, target);
          if (received === expected) {
            results.count.passed++;
            result.count.passed++;
          } else {
            results.count.failed++;
            result.count.failed++;
            result.failedTests.push({
              label: [file, description, testDescription],
              expected,
            });
          }
        } catch (error) {
          console.warn(
            `Error running compliance test for ${file} > ${description} > ${testDescription}:`,
            error,
          );
          results.count.failed++;
          result.count.failed++;
          result.failedTests.push({
            label: [file, description, testDescription],
            expected,
          });
        }
      }
    }
  }

  return results;
}

export async function getAllTargetsCompliance(
  complianceFn: ComplianceFn,
): Promise<Record<ComplianceTarget, ComplianceResults>> {
  return unsafeFromEntries(
    await Promise.all(
      targets.map(async (target) => [target, await getTargetCompliance(target, complianceFn)]),
    ),
  );
}
