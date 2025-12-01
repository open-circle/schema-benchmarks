import { defineBenchmarks } from "@schema-benchmarks/schemas";
import { getVersion } from "@schema-benchmarks/utils/node" with {
  type: "macro",
};
import ts from "dedent" with { type: "macro" };
import { getZodSchema } from ".";
import { getZodMiniSchema } from "./mini";

export default defineBenchmarks({
  library: {
    name: "zod",
    optimizeType: "jit",
    version: await getVersion("zod"),
  },
  createContext: () => ({
    schema: getZodSchema(),
    miniSchema: getZodMiniSchema(),
  }),
  initialization: [
    {
      run() {
        getZodSchema();
      },
      snippet: ts`z.object(...)`,
    },
    {
      run() {
        getZodMiniSchema();
      },
      snippet: ts`z.object(...)`,
      note: "mini",
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
        optimizeType: "runtime",
      },
      {
        run(data, { miniSchema }) {
          miniSchema.safeParse(data);
        },
        snippet: ts`schema.safeParse(data)`,
        note: "mini",
      },
      {
        run(data, { miniSchema }) {
          miniSchema.safeParse(data, { jitless: true });
        },
        snippet: ts`schema.safeParse(data, { jitless: true })`,
        note: "mini, jitless",
        optimizeType: "runtime",
      },
    ],
  },
});
