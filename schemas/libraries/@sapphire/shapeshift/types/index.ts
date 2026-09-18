import type { InferType } from "@sapphire/shapeshift";

import type { MatchAssertions } from "#src";

import { getShapeshiftSchema } from "..";

export const schema = getShapeshiftSchema();

export type Input = InferType<typeof schema>;

export type Output = InferType<typeof schema>;

export type Assertions = MatchAssertions<Input, Output>;
