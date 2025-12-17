import * as v from "valibot";

export const coerceNumber = v.union([
  v.number(),
  v.pipe(v.string(), v.toNumber()),
]);
