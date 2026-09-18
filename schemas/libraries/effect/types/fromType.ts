import * as Schema from "effect/Schema";

import type { FromTypeStyle, JsonSchemaOutputData as Product } from "#src";

export const style: FromTypeStyle = "annotation";

export const schema: Schema.Schema<Product> = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  price: Schema.Number,
});
