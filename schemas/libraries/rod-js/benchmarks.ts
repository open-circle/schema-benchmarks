import { assertNotReached, defineBenchmarks } from "@schema-benchmarks/schemas";
import { getVersion } from "@schema-benchmarks/utils/node" with {
  type: "macro",
};
import ts from "dedent" with { type: "macro" };
import { rod } from "rod-js";
import { getRodSchema } from ".";

export default defineBenchmarks({
  library: {
    name: "rod-js",
    git: "AxiomCore/rod",
    optimizeType: "none",
    version: await getVersion("rod-js"),
  },
  createContext: async () => {
    await rod.init();
    return { schema: getRodSchema() };
  },
  initialization: [
    {
      run() {
        getRodSchema();
      },
      snippet: ts`rod.object(...)`,
    },
    {
      run() {
        rod.init();
        getRodSchema();
      },
      snippet: ts`
        rod.init();
        rod.object(...)
      `,
      note: "init",
    },
  ],
  parsing: {
    allErrors: [
      {
        run(data, { schema }) {
          schema.safeParse(data, { mode: "lazy" });
        },
        note: "lazy",
        snippet: ts`schema.safeParse(data, { mode: "lazy" })`,
      },
      {
        run(data, { schema }) {
          schema.safeParse(data, { mode: "eager" });
        },
        note: "eager",
        snippet: ts`schema.safeParse(data, { mode: "eager" })`,
      },
    ],
  },
  stack: {
    throw: ({ schema }, data) => {
      schema.parse(data);
      assertNotReached();
    },
    snippet: ts`schema.parse(data)`,
  },
});
