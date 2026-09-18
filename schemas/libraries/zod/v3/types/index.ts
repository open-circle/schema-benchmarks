import type * as z from "zod/v3";

import type { MatchAssertions } from "#src";

import { getZodSchema } from "..";

export const schema = getZodSchema();

export type Input = z.input<typeof schema>;

export type Output = z.output<typeof schema>;

export type Assertions = MatchAssertions<Input, Output>;
