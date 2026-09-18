import * as S from "sury";

import type { FromTypeStyle, JsonSchemaOutputData } from "#src";

export const style: FromTypeStyle = "builder";

export const schema = S.schemaOf<JsonSchemaOutputData>()({
  id: S.number,
  name: S.string,
  price: S.number,
});
