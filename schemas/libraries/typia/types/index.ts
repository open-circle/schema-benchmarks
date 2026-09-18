import type { MatchAssertions } from "#src";

import type { TypiaSchema } from "..";

// the schema is a TypeScript type
export const schema = null as unknown as TypiaSchema;

export type Input = typeof schema;

export type Output = typeof schema;

export type Assertions = MatchAssertions<Input, Output>;
