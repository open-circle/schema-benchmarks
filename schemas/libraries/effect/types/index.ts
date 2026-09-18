import type * as Schema from "effect/Schema";

import { getEffectSchema } from "..";

export const schema = getEffectSchema();

export type Input = Schema.Schema.Encoded<typeof schema>;

export type Output = Schema.Schema.Type<typeof schema>;
