import { getVersion } from "@schema-benchmarks/utils/node" with {
  type: "macro",
};
import ts from "dedent" with { type: "macro" };
import { assertNotReached, defineBenchmarks } from "#src";
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
        getZodMiniSchema();
      },
      snippet: ts`z.object(...)`,
    },
  ],
  parsing: {
    allErrors: [
      {
        run(data, { schema }) {
          schema.safeParse(data);
        },
        snippet: ts`schema.safeParse(data)`,
      },
      {
        run(data, { schema }) {
          schema.safeParse(data, { jitless: true });
        },
        snippet: ts`schema.safeParse(data, { jitless: true })`,
        note: "jitless",
        optimizeType: "none",
      },
    ],
  },
  throw: ({ schema }, data) => {
    schema.parse(data);
    assertNotReached();
  },
});
