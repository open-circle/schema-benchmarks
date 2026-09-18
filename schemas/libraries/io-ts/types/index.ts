import type * as t from "io-ts";

import type { MatchAssertions } from "#src";

import { getIotsSchema } from "..";

export const schema = getIotsSchema();

// `OutputOf` is what `encode` returns; what `decode` accepts is `InputOf`, and for `t.type`
// that is `unknown`.
export type Input = t.InputOf<typeof schema>;

export type Output = t.TypeOf<typeof schema>;

export type Assertions = MatchAssertions<Input, Output>;
