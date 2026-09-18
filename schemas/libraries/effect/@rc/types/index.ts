import type * as Schema from "effect___rc/Schema";

import type { MatchAssertions } from "#src";

import { getEffectSchema } from "..";

export const schema = getEffectSchema();

export type Input = Schema.Codec.Encoded<typeof schema>;

export type Output = Schema.Schema.Type<typeof schema>;

export type Assertions = MatchAssertions<Input, Output>;
