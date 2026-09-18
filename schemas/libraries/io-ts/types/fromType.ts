import * as t from "io-ts";

import type { FromTypeStyle, JsonSchemaOutputData } from "#src";

export const style: FromTypeStyle = "annotation";

export const schema: t.Type<JsonSchemaOutputData> = t.type({
  id: t.number,
  name: t.string,
  price: t.number,
});
