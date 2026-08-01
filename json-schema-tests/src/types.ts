import type { MaybePromise } from "@schema-benchmarks/utils";
import * as v from "valibot";

import { targets } from "./constants.gen.ts";

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

export interface ComplianceResult {
  count: {
    passed: number;
    failed: number;
  };
  failedTests: Array<{
    label: Array<string>;
    expected: boolean;
  }>;
}

export type ComplianceFn = (
  schema: {} | boolean,
  data: unknown,
  target: ComplianceTarget,
) => MaybePromise<boolean>;
