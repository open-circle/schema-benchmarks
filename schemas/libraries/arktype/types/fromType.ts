import { type Type, type } from "arktype";

import type { FromTypeStyle, JsonSchemaOutputData as Product } from "#src";

export const style: FromTypeStyle = "annotation";

export const schema: Type<Product> = type({
  id: "number",
  name: "string",
  price: "number",
});
