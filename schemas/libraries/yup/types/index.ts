import type * as yup from "yup";

import type { MatchAssertions } from "#src";

import { getYupSchema } from "..";

export const schema = getYupSchema();

export type Input = yup.InferType<typeof schema>;

export type Output = yup.InferType<typeof schema>;

export type Assertions = MatchAssertions<Input, Output>;
