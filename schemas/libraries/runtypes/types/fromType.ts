import { Object as RtObject, String as RtString, Number as RtNumber, type Runtype } from "runtypes";

import type { JsonSchemaOutputData } from "#src";

export const schema: Runtype.Core<JsonSchemaOutputData> = RtObject({
  id: RtNumber,
  name: RtString,
  price: RtNumber,
});
