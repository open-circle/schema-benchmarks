import type { TypiaSchema } from "..";

// the schema is a TypeScript type
export const schema = null as unknown as TypiaSchema;

export const note = "the schema is a TypeScript type";

export const noInference =
  "typia has no runtime schema value to read a type from - `Input`/`Output` would just be the type this file already stands in for, not something inferred from it.";
