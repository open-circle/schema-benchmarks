import type { Static } from "runtypes";

import type { MatchAssertions } from "#src";

import { getRuntypesSchema } from "..";

export const schema = getRuntypesSchema();

export type Input = Static<typeof schema>;

export type Output = Static<typeof schema>;

export type Assertions = MatchAssertions<Input, Output>;
