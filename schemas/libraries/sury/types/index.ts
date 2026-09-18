import type * as S from "sury";

import { getSurySchema } from "..";

export const schema = getSurySchema();

export type Input = S.Input<typeof schema>;

export type Output = S.Output<typeof schema>;
