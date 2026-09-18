import type { InferInput, InferOutput } from "@remix-run/data-schema";

import type { MatchAssertions } from "#src";

import { getRemixSchema } from "..";

export const schema = getRemixSchema();

export type Input = InferInput<typeof schema>;

export type Output = InferOutput<typeof schema>;

export type Assertions = MatchAssertions<Input, Output>;
