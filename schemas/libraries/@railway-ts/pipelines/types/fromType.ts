import { object, number, string, required, type Validator } from "@railway-ts/pipelines/schema";

import type { JsonSchemaOutputData } from "#src";

export const schema: Validator<unknown, JsonSchemaOutputData> = object({
  id: required(number()),
  name: required(string()),
  price: required(number()),
});
