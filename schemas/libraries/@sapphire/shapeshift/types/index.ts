import type { InferType } from "@sapphire/shapeshift";

import { getShapeshiftSchema } from "..";

export const schema = getShapeshiftSchema();

export type Input = InferType<typeof schema>;

export type Output = InferType<typeof schema>;
