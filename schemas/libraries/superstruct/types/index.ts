import type { Infer } from "superstruct";

import type { MatchAssertions } from "#src";

import { getSuperstructSchema } from "..";

export const schema = getSuperstructSchema();

export type Input = Infer<typeof schema>;

export type Output = Infer<typeof schema>;

export type Assertions = MatchAssertions<Input, Output>;
