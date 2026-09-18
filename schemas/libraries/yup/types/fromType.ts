import * as yup from "yup";

import type { FromTypeStyle, JsonSchemaOutputData as Product } from "#src";

export const style: FromTypeStyle = "annotation";

export const schema: yup.ObjectSchema<Product> = yup.object({
  id: yup.number().required(),
  name: yup.string().required(),
  price: yup.number().required(),
});
