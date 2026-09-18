import * as p from "@paseri/paseri";

import type { FromTypeStyle, JsonSchemaOutputData as Product } from "#src";

export const style: FromTypeStyle = "annotation";

export const schema: p.Schema<Product> = p.object({
  id: p.number(),
  name: p.string(),
  price: p.number(),
});
