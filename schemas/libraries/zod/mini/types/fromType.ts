import * as z from "zod/mini";

import type { FromTypeStyle, JsonSchemaOutputData } from "#src";

export const style: FromTypeStyle = "builder";

export const schema = z.toZod<JsonSchemaOutputData>()(
  z.object({ id: z.number(), name: z.string(), price: z.number() }),
);
