import type * as v from "valibot";

import { getValibotSchema } from "..";

export const schema = getValibotSchema();

export type Input = v.InferInput<typeof schema>;

export type Output = v.InferOutput<typeof schema>;
