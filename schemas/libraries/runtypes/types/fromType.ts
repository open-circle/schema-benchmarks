import { Object as RtObject, String as RtString, Number as RtNumber, type Runtype } from "runtypes";

import type { FromTypeStyle, JsonSchemaOutputData } from "#src";

export const style: FromTypeStyle = "annotation";

export const schema: Runtype.Core<JsonSchemaOutputData> = RtObject({
  id: RtNumber,
  name: RtString,
  price: RtNumber,
});
