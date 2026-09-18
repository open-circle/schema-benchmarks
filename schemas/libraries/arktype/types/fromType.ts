import { type Type, type } from "arktype";

import type { JsonSchemaOutputData } from "#src";

export const schema: Type<JsonSchemaOutputData> = type({
  id: "number",
  name: "string",
  price: "number",
});
