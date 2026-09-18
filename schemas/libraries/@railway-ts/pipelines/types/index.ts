import type { InferSchemaType } from "@railway-ts/pipelines/schema";

import { getRailwayTsSchema } from "..";

export const schema = getRailwayTsSchema();

export type Input = InferSchemaType<typeof schema>;

export type Output = InferSchemaType<typeof schema>;
