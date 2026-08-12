import * as fs from "node:fs";
import * as path from "node:path";

import * as v from "valibot";

import type {
  ComplianceContext,
  ComplianceTarget,
  ComplianceFn,
  FileComplianceResult,
  ComplianceResults,
} from "./types.ts";
import { testCaseSchema } from "./types.ts";

let remoteSchemasPromise: Promise<ComplianceContext["remotes"]> | undefined;

function getRemoteSchemas(): Promise<ComplianceContext["remotes"]> {
  remoteSchemasPromise ??= loadRemoteSchemas();
  return remoteSchemasPromise;
}

async function loadRemoteSchemas(): Promise<ComplianceContext["remotes"]> {
  const remotesDir = path.join(import.meta.dirname, "../remotes");
  const files = fs.readdirSync(remotesDir, { recursive: true, withFileTypes: true });

  const entries = await Promise.all(
    files
      .filter((file) => file.isFile() && file.name.endsWith(".json"))
      .map(async (file) => {
        const filePath = path.join(file.parentPath, file.name);
        const relativePath = path.relative(remotesDir, filePath).split(path.sep).join("/");
        const remoteSchema = await import(/* @vite-ignore */ `#remotes/${relativePath}`, {
          with: { type: "json" },
        });

        return [`http://localhost:1234/${relativePath}`, remoteSchema.default] as const;
      }),
  );

  return Object.fromEntries(entries);
}

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
  const context: ComplianceContext = { target, remotes: await getRemoteSchemas() };
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
          const received = await complianceFn(schema, data, context);
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
