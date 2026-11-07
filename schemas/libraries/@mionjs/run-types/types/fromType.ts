import { createValidateFn } from "@mionjs/run-types";

import type { FromTypeStyle, JsonSchemaOutputData as Product } from "#src";

export const style: FromTypeStyle = "builder";

export const derived = true;

// the validator is generated from the type, so the two cannot disagree
export const schema = createValidateFn<Product>();
