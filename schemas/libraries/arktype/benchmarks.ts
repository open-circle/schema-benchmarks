import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import { type } from "arktype";
import ts from "dedent";

import type { StringBenchmarkConfig } from "#src";
import { defineBenchmarks } from "#src";

import { getArkTypeSchema } from ".";

type Format = Exclude<keyof typeof type.keywords.string, ` ${string}`>;

const createStringBenchmark = (format: Format): StringBenchmarkConfig<unknown> => ({
  create() {
    return type(`string.${format}`).allows;
  },
  snippet: ts`type("string.${format}")`,
});

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
    email: createStringBenchmark("email"),
    url: createStringBenchmark("url"),
    uuid: createStringBenchmark("uuid"),
  },
});
