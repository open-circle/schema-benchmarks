import { object, number, string, type Describe } from "superstruct";

import type { JsonSchemaOutputData } from "#src";

export const schema: Describe<JsonSchemaOutputData> = object({
  id: number(),
  name: string(),
  price: number(),
});
