import * as v from "valibot";

import type { FromTypeStyle, JsonSchemaOutputData as Product } from "#src";

export const style: FromTypeStyle = "annotation";

export const schema: v.GenericSchema<Product> = v.object({
  id: v.number(),
  name: v.string(),
  price: v.number(),
});
