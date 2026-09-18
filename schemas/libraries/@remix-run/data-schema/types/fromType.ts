import { object, number, string, type Schema } from "@remix-run/data-schema";

import type { JsonSchemaOutputData } from "#src";

export const schema: Schema<unknown, JsonSchemaOutputData> = object({
  id: number(),
  name: string(),
  price: number(),
});
