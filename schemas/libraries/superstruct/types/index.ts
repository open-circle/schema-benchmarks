import type { Infer } from "superstruct";

import { getSuperstructSchema } from "..";

export const schema = getSuperstructSchema();

export type Input = Infer<typeof schema>;

export type Output = Infer<typeof schema>;
