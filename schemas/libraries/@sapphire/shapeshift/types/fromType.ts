import { s, type BaseValidator } from "@sapphire/shapeshift";

import type { JsonSchemaOutputData } from "#src";

export const schema: BaseValidator<JsonSchemaOutputData> = s.object({
  id: s.number(),
  name: s.string(),
  price: s.number(),
});
