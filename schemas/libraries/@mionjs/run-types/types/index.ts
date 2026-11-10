import type { MionSchema } from "..";

// the schema is a TypeScript type
export const schema = null as unknown as MionSchema;

export const noInference =
  "@mionjs/run-types has no runtime schema value to read a type from - the schema a user writes is the type itself, so there is nothing to infer that isn't already given.";
