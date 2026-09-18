import type * as z from "zod/mini";

import type { MatchAssertions } from "#src";

import { getZodMiniSchema } from "..";

export const schema = getZodMiniSchema();

export type Input = z.input<typeof schema>;

export type Output = z.output<typeof schema>;

export type Assertions = MatchAssertions<Input, Output>;
