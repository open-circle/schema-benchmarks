import { s, type BaseValidator } from "@sapphire/shapeshift";

import type { FromTypeStyle, JsonSchemaOutputData } from "#src";

export const style: FromTypeStyle = "annotation";

export const schema: BaseValidator<JsonSchemaOutputData> = s.object({
  id: s.number(),
  name: s.string(),
  price: s.number(),
});
