import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import { type } from "arktype";
import ts from "dedent" with { type: "macro" };

import { defineBenchmarks } from "#src";

import { getArkTypeSchema } from ".";

export default defineBenchmarks({
  library: {
    name: "arktype",
    git: "arktypeio/arktype",
    optimizeType: "jit",
    version: await getVersion("arktype"),
  },
  createContext: () => ({ schema: getArkTypeSchema() }),
  initialization: {
    run() {
      return getArkTypeSchema();
    },
    snippet: ts`type(...)`,
  },
  validation: {
    run(data, { schema }) {
      return schema.allows(data);
    },
    snippet: ts`schema.allows(data)`,
  },
  parsing: {
    allErrors: {
      run(data, { schema }) {
        return schema(data);
      },
      validateResult: (result) => !(result instanceof type.errors),
      snippet: ts`schema(data)`,
    },
  },
  standard: {
    allErrors: {
      getSchema: ({ schema }) => schema,
    },
  },
  string: {
    email: {
      create() {
        return type("string.email").allows;
      },
      snippet: ts`type("string.email")`,
    },
    url: {
      create() {
        return type("string.url").allows;
      },
      snippet: ts`type("string.url")`,
    },
    uuid: {
      create() {
        return type("string.uuid").allows;
      },
      snippet: ts`type("string.uuid")`,
    },
  },
});
