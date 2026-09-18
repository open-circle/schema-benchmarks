import type * as S from "sury";

import type { MatchAssertions } from "#src";

import { getSurySchema } from "..";

export const schema = getSurySchema();

export type Input = S.Input<typeof schema>;

export type Output = S.Output<typeof schema>;

export type Assertions = MatchAssertions<Input, Output>;
