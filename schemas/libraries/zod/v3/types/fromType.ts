import * as z from "zod/v3";

import type { FromTypeStyle, JsonSchemaOutputData as Product } from "#src";

export const style: FromTypeStyle = "annotation";

export const schema: z.ZodType<Product> = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
});
