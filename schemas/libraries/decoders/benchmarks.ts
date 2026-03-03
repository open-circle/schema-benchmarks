import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";

import { assertNotReached, defineBenchmarks } from "#src";

import { getDecoderSchema } from ".";

export default defineBenchmarks({
  library: {
    name: "decoders",
    git: "nvie/decoders",
    optimizeType: "none",
    version: await getVersion("decoders"),
  },
  createContext: () => ({ schema: getDecoderSchema() }),
  initialization: {
    run() {
      return getDecoderSchema();
    },
    snippet: ts`object(...)`,
  },
  parsing: {
    allErrors: {
      run(data, { schema }) {
        return schema.decode(data);
      },
      validateResult: (result) => result.ok,
      snippet: ts`schema.decode(data)`,
    },
  },
  stack: {
    throw: ({ schema }, data) => {
      schema.verify(data);
      assertNotReached();
    },
    snippet: ts`schema.verify(data)`,
  },
});
