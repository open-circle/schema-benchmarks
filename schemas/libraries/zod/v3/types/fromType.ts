import * as z from "zod/v3";

import type { FromTypeStyle, JsonSchemaOutputData } from "#src";

export const style: FromTypeStyle = "annotation";

export const schema: z.ZodType<JsonSchemaOutputData> = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
});
