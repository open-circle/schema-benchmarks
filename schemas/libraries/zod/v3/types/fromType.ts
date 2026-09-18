import * as z from "zod/v3";

import type { JsonSchemaOutputData } from "#src";

export const schema: z.ZodType<JsonSchemaOutputData> = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
});
