import { defineBenchmarks } from "@schema-benchmarks/schemas";
import { getVersion } from "@schema-benchmarks/utils/node" with {
  type: "macro",
};
import ts from "dedent" with { type: "macro" };
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
      getArkTypeSchema();
    },
    snippet: ts`type(...)`,
  },
  validation: {
    run(data, { schema }) {
      schema.allows(data);
    },
    snippet: ts`schema.allows(data)`,
  },
  parsing: {
    allErrors: {
      run(data, { schema }) {
        schema(data);
      },
      snippet: ts`schema(data)`,
    },
  },
});
