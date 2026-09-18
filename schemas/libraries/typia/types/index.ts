import type { TypiaSchema } from "..";

// the schema is a TypeScript type
export const schema = null as unknown as TypiaSchema;

export const noInference =
  "typia has no runtime schema value to read a type from - the schema a user writes is the type itself, so there is nothing to infer that isn't already given.";
