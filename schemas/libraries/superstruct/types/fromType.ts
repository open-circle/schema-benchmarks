import { object, number, string, type Describe } from "superstruct";

import type { FromTypeStyle, JsonSchemaOutputData as Product } from "#src";

export const style: FromTypeStyle = "annotation";

export const schema: Describe<Product> = object({
  id: number(),
  name: string(),
  price: number(),
});
