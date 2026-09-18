import * as yup from "yup";

import type { JsonSchemaOutputData } from "#src";

export const schema: yup.ObjectSchema<JsonSchemaOutputData> = yup.object({
  id: yup.number().required(),
  name: yup.string().required(),
  price: yup.number().required(),
});
