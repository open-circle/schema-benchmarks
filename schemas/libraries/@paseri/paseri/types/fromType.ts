import * as p from "@paseri/paseri";

import type { FromTypeStyle, JsonSchemaOutputData } from "#src";

export const style: FromTypeStyle = "annotation";

export const schema: p.Schema<JsonSchemaOutputData> = p.object({
  id: p.number(),
  name: p.string(),
  price: p.number(),
});
