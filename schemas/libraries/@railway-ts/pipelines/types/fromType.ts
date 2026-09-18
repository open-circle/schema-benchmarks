import { object, number, string, required, type Validator } from "@railway-ts/pipelines/schema";

import type { FromTypeStyle, JsonSchemaOutputData } from "#src";

export const style: FromTypeStyle = "annotation";

export const schema: Validator<unknown, JsonSchemaOutputData> = object({
  id: required(number()),
  name: required(string()),
  price: required(number()),
});
