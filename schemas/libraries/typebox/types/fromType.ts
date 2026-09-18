import type { Satisfies } from "@schema-benchmarks/utils";
import * as Type from "typebox";

import type { JsonSchemaOutputData } from "#src";

export const schema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  price: Type.Number(),
});

export type SchemaChecked = Satisfies<Type.Static<typeof schema>, JsonSchemaOutputData>;
