import * as v from "valibot";

export async function parseDefault<TSchema extends v.GenericSchema>(
  importPromise: Promise<{ default: unknown }>,
  schema: TSchema,
) {
  const module = await importPromise;
  return v.parse(schema, module.default);
}
