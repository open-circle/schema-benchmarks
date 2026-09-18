import type { InferSchemaType } from "@railway-ts/pipelines/schema";

import type { MatchAssertions } from "#src";

import { getRailwayTsSchema } from "..";

export const schema = getRailwayTsSchema();

export type Input = InferSchemaType<typeof schema>;

export type Output = InferSchemaType<typeof schema>;

export type Assertions = MatchAssertions<Input, Output>;
