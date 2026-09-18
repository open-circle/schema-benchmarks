import { object, number, string, required, type Validator } from "@railway-ts/pipelines/schema";

import type { FromTypeStyle, JsonSchemaOutputData as Product } from "#src";

export const style: FromTypeStyle = "annotation";

export const schema: Validator<unknown, Product> = object({
  id: required(number()),
  name: required(string()),
  price: required(number()),
});
