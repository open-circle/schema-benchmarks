import * as S from "sury";

import type { FromTypeStyle, JsonSchemaOutputData as Product } from "#src";

export const style: FromTypeStyle = "builder";

export const schema = S.schemaOf<Product>()({
  id: S.number,
  name: S.string,
  price: S.number,
});
