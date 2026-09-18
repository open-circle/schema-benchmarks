import typia from "typia";

import type { JsonSchemaOutputData } from "#src";

// the schema is generated from the type, so the two cannot disagree
export const schema = typia.createAssert<JsonSchemaOutputData>();
