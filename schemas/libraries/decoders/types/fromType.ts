import { object, number, string, type Decoder } from "decoders";

import type { FromTypeStyle, JsonSchemaOutputData } from "#src";

export const style: FromTypeStyle = "annotation";

export const schema: Decoder<JsonSchemaOutputData> = object({
  id: number,
  name: string,
  price: number,
});
