import * as v from "valibot";

import type { JsonSchemaOutputData } from "#src";

export const schema: v.GenericSchema<JsonSchemaOutputData> = v.object({
  id: v.number(),
  name: v.string(),
  price: v.number(),
});
