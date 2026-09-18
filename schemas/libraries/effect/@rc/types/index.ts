import type * as Schema from "effect___rc/Schema";

import { getEffectSchema } from "..";

export const schema = getEffectSchema();

export type Input = Schema.Codec.Encoded<typeof schema>;

export type Output = Schema.Schema.Type<typeof schema>;
