import { object, number, string, type Decoder } from "decoders";

import type { FromTypeStyle, JsonSchemaOutputData as Product } from "#src";

export const style: FromTypeStyle = "annotation";

export const schema: Decoder<Product> = object({
  id: number,
  name: string,
  price: number,
});
