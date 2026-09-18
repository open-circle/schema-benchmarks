import { s, type BaseValidator } from "@sapphire/shapeshift";

import type { FromTypeStyle, JsonSchemaOutputData as Product } from "#src";

export const style: FromTypeStyle = "annotation";

export const schema: BaseValidator<Product> = s.object({
  id: s.number(),
  name: s.string(),
  price: s.number(),
});
