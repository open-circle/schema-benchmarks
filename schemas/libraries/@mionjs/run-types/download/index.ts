import { createGetValidationErrorsFn, createValidateFn } from "@mionjs/run-types";

import type { MionSchema } from "..";

const validate = createValidateFn<MionSchema>();
const getErrors = createGetValidationErrorsFn<MionSchema>();
const data: unknown = {};
if (!validate(data)) getErrors(data);
