import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent" with { type: "macro" };

import { defineBenchmarks } from "#src";

import { getZodMiniSchema } from ".";

export default defineBenchmarks({
  library: {
    name: "zod/mini",
    git: "colinhacks/zod",
    optimizeType: "jit",
    version: await getVersion("zod"),
  },
  createContext: () => ({
    schema: getZodMiniSchema(),
  }),
  initialization: [
    {
      run() {
        return getZodMiniSchema();
      },
      snippet: ts`z.object(...)`,
    },
  ],
  parsing: {
    allErrors: [
      {
        // manually annotate return type, as SafeParseResult is not exported from zod/mini and thus not portable
        run(data, { schema }): { success: boolean } {
          return schema.safeParse(data);
        },
        validateResult: (result) => result.success,
        snippet: ts`schema.safeParse(data)`,
      },
      {
        run(data, { schema }): { success: boolean } {
          return schema.safeParse(data, { jitless: true });
        },
        validateResult: (result) => result.success,
        snippet: ts`schema.safeParse(data, { jitless: true })`,
        note: "jitless",
        optimizeType: "none",
      },
    ],
  },
  standard: {
    allErrors: {
      getSchema: ({ schema }) => schema,
    },
  },
});
