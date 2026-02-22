import type { MaybePromise } from "@schema-benchmarks/utils";
import type { StandardSchemaV1 } from "@standard-schema/spec";

export function parse<T extends StandardSchemaV1>(
  schema: T,
  data: unknown,
): MaybePromise<StandardSchemaV1.Result<StandardSchemaV1.InferOutput<T>>> {
  return schema["~standard"].validate(data);
}
