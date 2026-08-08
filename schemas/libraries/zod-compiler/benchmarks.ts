import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";

import { assertNotReached, defineBenchmarks } from "#src";

import { compiledProductSchema } from "./index.gen";

export default defineBenchmarks({
  library: {
    name: "zod-compiler",
    optimizeType: "precompiled",
    version: await getVersion("zod-compiler"),
  },
  parsing: {
    allErrors: [
      {
        run(data) {
          return compiledProductSchema.safeParse(data);
        },
        validateResult: (result) => result.success,
        snippet: ts`schema.safeParse(data)`,
      },
      {
        run(data) {
          return compiledProductSchema.safeParse(data, { jitless: true });
        },
        validateResult: (result) => result.success,
        snippet: ts`schema.safeParse(data, { jitless: true })`,
      },
    ],
  },
  standard: {
    allErrors: { schema: compiledProductSchema },
  },
  stack: {
    throw: (data) => {
      compiledProductSchema.parse(data);
      assertNotReached();
    },
    snippet: ts`schema.parse(data)`,
  },
});
