import type { DecoderType } from "decoders";

import { getDecoderSchema } from "..";

export const schema = getDecoderSchema();

export type Input = DecoderType<typeof schema>;

export type Output = DecoderType<typeof schema>;
