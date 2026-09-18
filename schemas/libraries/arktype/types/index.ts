import type { MatchAssertions } from "#src";

import { getArkTypeSchema } from "..";

export const schema = getArkTypeSchema();

export type Input = (typeof schema)["inferIn"];

export type Output = (typeof schema)["infer"];

export type Assertions = MatchAssertions<Input, Output>;
