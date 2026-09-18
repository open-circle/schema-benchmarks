import * as p from "@paseri/paseri";

import type { JsonSchemaOutputData } from "#src";

export const schema: p.Schema<JsonSchemaOutputData> = p.object({
  id: p.number(),
  name: p.string(),
  price: p.number(),
});
