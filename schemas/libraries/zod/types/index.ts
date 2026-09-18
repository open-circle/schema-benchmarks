import type * as z from "zod";

import { getZodSchema } from "..";

export const schema = getZodSchema();

export type Input = z.input<typeof schema>;

export type Output = z.output<typeof schema>;
