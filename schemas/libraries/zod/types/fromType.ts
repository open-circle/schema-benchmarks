import * as z from "zod";

import type { FromTypeStyle, JsonSchemaOutputData as Product } from "#src";

export const style: FromTypeStyle = "builder";

export const schema = z.toZod<Product>()(
  z.object({ id: z.number(), name: z.string(), price: z.number() }),
);
