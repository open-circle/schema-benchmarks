import { object, number, string, type Describe } from "superstruct";

import type { FromTypeStyle, JsonSchemaOutputData } from "#src";

export const style: FromTypeStyle = "annotation";

export const schema: Describe<JsonSchemaOutputData> = object({
  id: number(),
  name: string(),
  price: number(),
});
