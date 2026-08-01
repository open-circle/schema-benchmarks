import * as v from "valibot";

import { targets } from "./constants.gen.ts";

export const testCaseSchema = v.object({
  description: v.string(),
  schema: v.unknown(),
  tests: v.array(
    v.object({
      description: v.string(),
      data: v.any(),
      valid: v.boolean(),
    }),
  ),
});
export type TestCase = v.InferOutput<typeof testCaseSchema>;

export const targetSchema = v.picklist(targets);
export type Target = v.InferOutput<typeof targetSchema>;
