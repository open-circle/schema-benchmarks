import { Object as RtObject, String as RtString, Number as RtNumber, type Runtype } from "runtypes";

import type { FromTypeStyle, JsonSchemaOutputData as Product } from "#src";

export const style: FromTypeStyle = "annotation";

export const schema: Runtype.Core<Product> = RtObject({
  id: RtNumber,
  name: RtString,
  price: RtNumber,
});
