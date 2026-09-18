import * as v from "valibot";

import type { FromTypeStyle, JsonSchemaOutputData } from "#src";

export const style: FromTypeStyle = "annotation";

export const schema: v.GenericSchema<JsonSchemaOutputData> = v.object({
  id: v.number(),
  name: v.string(),
  price: v.number(),
});
