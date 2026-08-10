import * as fs from "node:fs";
import * as path from "node:path";

import * as v from "valibot";

import type {
  ComplianceTarget,
  ComplianceFn,
  FileComplianceResult,
  ComplianceResults,
} from "./types.ts";
import { testCaseSchema } from "./types.ts";

export async function* getTestCases(target: ComplianceTarget) {
  const testCasesDir = path.join(import.meta.dirname, "../tests", target);
  const testCaseFiles = fs.readdirSync(testCasesDir).filter((file) => file.endsWith(".json"));
  for (const file of testCaseFiles) {
    yield [
      path.basename(file, ".json"),
      v.parse(
        v.array(testCaseSchema),
        /* @vite-ignore */
        await import(`#tests/${target}/${file}`, { with: { type: "json" } }).then((m) => m.default),
      ),
    ] as const;
  }
}

export async function getTargetCompliance(
  target: ComplianceTarget,
  complianceFn: ComplianceFn,
  log = false,
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
      count: {
        passed: 0,
        failed: 0,
      },
    };
    results.files[file] = result;
    for (const { schema, tests } of testCases) {
      for (const { data, valid: expected } of tests) {
        try {
          const received = await complianceFn(schema, data, target);
          if (received === expected) {
            results.count.passed++;
            result.count.passed++;
          } else {
            results.count.failed++;
            result.count.failed++;
            // result.failedTests.push([description, testDescription]);
          }
        } catch (err) {
          if (log) {
            console.error(`Error running compliance function for ${file}`, err);
          }
          results.count.failed++;
          result.count.failed++;
          // result.failedTests.push([description, testDescription]);
        }
      }
    }
  }

  return results;
}
