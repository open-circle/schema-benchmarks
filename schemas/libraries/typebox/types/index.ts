import type * as Type from "typebox";

import { getTypeboxSchema } from "..";

export const schema = getTypeboxSchema();

export type Input = Type.StaticEncode<typeof schema>;

export type Output = Type.StaticDecode<typeof schema>;
