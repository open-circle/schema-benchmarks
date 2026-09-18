import type * as v from "valibot";

import type { MatchAssertions } from "#src";

import { getValibotSchema } from "..";

export const schema = getValibotSchema();

export type Input = v.InferInput<typeof schema>;

export type Output = v.InferOutput<typeof schema>;

export type Assertions = MatchAssertions<Input, Output>;
