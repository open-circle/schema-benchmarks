import type { MaybePromise } from "@schema-benchmarks/utils";
import * as v from "valibot";

import targets from "#constants/targets.gen.ts";

export { default as targets } from "#constants/targets.gen.ts";
export { default as sha } from "#constants/sha.gen.ts";

export const testCaseSchema = v.object({
  description: v.string(),
  schema: v.union([v.looseObject({}), v.boolean()]),
  tests: v.array(
    v.object({
      description: v.string(),
      data: v.any(),
      valid: v.boolean(),
    }),
  ),
});
export type TestCase = v.InferOutput<typeof testCaseSchema>;

export const complianceTargetSchema = v.picklist(targets);
export type ComplianceTarget = v.InferOutput<typeof complianceTargetSchema>;

export interface ComplianceContext {
  target: ComplianceTarget;
}

export const fileComplianceResultSchema = v.object({
  count: v.object({
    passed: v.number(),
    failed: v.number(),
  }),
  // disable for now - makes the output about 8x larger
  // file level granularity is fine
  // failedTests: v.array(v.array(v.string())),
});
export type FileComplianceResult = v.InferOutput<typeof fileComplianceResultSchema>;

export const complianceResultsSchema = v.object({
  count: v.object({
    passed: v.number(),
    failed: v.number(),
  }),
  files: v.record(v.string(), fileComplianceResultSchema),
});
export type ComplianceResults = v.InferOutput<typeof complianceResultsSchema>;

export type ComplianceFn = (
  schema: {} | boolean,
  data: unknown,
  context: ComplianceContext,
) => MaybePromise<boolean>;
