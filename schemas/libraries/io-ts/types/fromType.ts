import * as t from "io-ts";

import type { FromTypeStyle, JsonSchemaOutputData as Product } from "#src";

export const style: FromTypeStyle = "annotation";

export const schema: t.Type<Product> = t.type({
  id: t.number,
  name: t.string,
  price: t.number,
});
