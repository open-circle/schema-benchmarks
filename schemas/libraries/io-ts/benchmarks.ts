import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent" with { type: "macro" };

import { defineBenchmarks } from "#src";

import { getIotsSchema } from ".";

export default defineBenchmarks({
  library: {
    name: "io-ts",
    git: "gcanti/io-ts",
    optimizeType: "none",
    version: await getVersion("io-ts"),
  },
  createContext: () => ({
    schema: getIotsSchema(),
  }),
  initialization: {
    run() {
      getIotsSchema();
    },
    snippet: ts`t.type(...)`,
  },
  validation: {
    run(data, { schema }) {
      schema.is(data);
    },
    snippet: ts`schema.is(data)`,
  },
  parsing: {
    allErrors: {
      run(data, { schema }) {
        schema.decode(data);
      },
      snippet: ts`schema.decode(data)`,
    },
  },
});
