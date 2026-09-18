import * as S from "sury";

import type { JsonSchemaOutputData } from "#src";

export const schema = S.schemaOf<JsonSchemaOutputData>()({
  id: S.number,
  name: S.string,
  price: S.number,
});
