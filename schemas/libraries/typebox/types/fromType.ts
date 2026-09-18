import type { Satisfies } from "@schema-benchmarks/utils";
import * as Type from "typebox";

import type { FromTypeStyle, JsonSchemaOutputData } from "#src";

export const style: FromTypeStyle = "annotation";

export const schema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  price: Type.Number(),
});

export type SchemaChecked = Satisfies<Type.Static<typeof schema>, JsonSchemaOutputData>;
