import { object, number, string, type Decoder } from "decoders";

import type { JsonSchemaOutputData } from "#src";

export const schema: Decoder<JsonSchemaOutputData> = object({
  id: number,
  name: string,
  price: number,
});
