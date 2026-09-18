import { type Type, type } from "arktype";

import type { FromTypeStyle, JsonSchemaOutputData } from "#src";

export const style: FromTypeStyle = "annotation";

export const schema: Type<JsonSchemaOutputData> = type({
  id: "number",
  name: "string",
  price: "number",
});
