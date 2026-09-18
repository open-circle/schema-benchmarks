import * as z from "zod/mini";

import type { JsonSchemaOutputData } from "#src";

export const schema = z.toZod<JsonSchemaOutputData>()(
  z.object({ id: z.number(), name: z.string(), price: z.number() }),
);
