import type { InferInput, InferOutput } from "@remix-run/data-schema";

import { getRemixSchema } from "..";

export const schema = getRemixSchema();

export type Input = InferInput<typeof schema>;

export type Output = InferOutput<typeof schema>;
