import * as yup from "yup";

import type { FromTypeStyle, JsonSchemaOutputData } from "#src";

export const style: FromTypeStyle = "annotation";

export const schema: yup.ObjectSchema<JsonSchemaOutputData> = yup.object({
  id: yup.number().required(),
  name: yup.string().required(),
  price: yup.number().required(),
});
