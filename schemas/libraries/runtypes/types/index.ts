import type { Static } from "runtypes";

import { getRuntypesSchema } from "..";

export const schema = getRuntypesSchema();

export type Input = Static<typeof schema>;

export type Output = Static<typeof schema>;
