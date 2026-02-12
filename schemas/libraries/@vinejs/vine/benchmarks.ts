import { getVersion } from "@schema-benchmarks/utils/node" with {
  type: "macro",
};
import vine from "@vinejs/vine";
import ts from "dedent" with { type: "macro" };
import { assertNotReached, defineBenchmarks } from "#src";
import { getVineSchema } from ".";

export default defineBenchmarks({
  library: {
    name: "@vinejs/vine",
    git: "vinejs/vine",
    optimizeType: "jit",
    version: await getVersion("@vinejs/vine"),
  },
  createContext: () => ({
    schema: getVineSchema(),
    noBailSchema: getVineSchema().bail(false),
  }),
  initialization: {
    run() {
      getVineSchema();
    },
    snippet: ts`vine.object(...)`,
  },
  parsing: {
    abortEarly: {
      run(data, { schema }) {
        vine.tryValidate({ schema, data });
      },
      snippet: ts`vine.tryValidate({ schema, data })`,
    },
    allErrors: {
      run(data, { noBailSchema }) {
        vine.tryValidate({ schema: noBailSchema, data });
      },
      snippet: ts`vine.tryValidate({ schema: schema.bail(false), data })`,
    },
  },
  throw: async ({ schema }, data) => {
    await vine.validate({ schema, data });
    assertNotReached();
  },
});
