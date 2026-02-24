import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent" with { type: "macro" };
import { isRight } from "fp-ts/lib/Either";

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
      return getIotsSchema();
    },
    snippet: ts`t.type(...)`,
  },
  validation: {
    run(data, { schema }) {
      return schema.is(data);
    },
    snippet: ts`schema.is(data)`,
  },
  parsing: {
    allErrors: {
      run(data, { schema }) {
        return schema.decode(data);
      },
      validateResult: isRight,
      snippet: ts`schema.decode(data)`,
    },
  },
});
