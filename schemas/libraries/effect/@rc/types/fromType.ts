import * as Schema from "effect___rc/Schema";

import type { FromTypeStyle, JsonSchemaOutputData } from "#src";

export const style: FromTypeStyle = "annotation";

export const schema: Schema.Schema<JsonSchemaOutputData> = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  price: Schema.Number,
});
