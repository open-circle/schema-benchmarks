import typia from "typia";

import type { FromTypeStyle, JsonSchemaOutputData } from "#src";

export const style: FromTypeStyle = "builder";

export const derived = true;

// the schema is generated from the type, so the two cannot disagree
export const schema = typia.createAssert<JsonSchemaOutputData>();
