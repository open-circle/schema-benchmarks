import { object, number, string, type Schema } from "@remix-run/data-schema";

import type { FromTypeStyle, JsonSchemaOutputData as Product } from "#src";

export const style: FromTypeStyle = "annotation";

export const schema: Schema<unknown, Product> = object({
  id: number(),
  name: string(),
  price: number(),
});
