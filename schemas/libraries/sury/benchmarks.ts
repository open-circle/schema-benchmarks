import { getVersion } from "@schema-benchmarks/utils/node" with {
  type: "macro",
};
import ts from "dedent" with { type: "macro" };
import * as S from "sury";
import { assertNotReached, defineBenchmarks } from "#src";
import { getSurySchema } from ".";

export default defineBenchmarks({
  library: {
    name: "sury",
    git: "DZakh/sury",
    optimizeType: "jit",
    version: await getVersion("sury"),
  },
  createContext: () => ({
    schema: getSurySchema(),
    compile: S.compile(getSurySchema(), "Any", "Output", "Sync"),
  }),
  initialization: [
    {
      run() {
        getSurySchema();
      },
      snippet: ts`S.schema(...)`,
    },
    {
      run() {
        S.compile(getSurySchema(), "Any", "Output", "Sync");
      },
      snippet: ts`S.compile(S.schema(...))`,
      note: "compile",
      optimizeType: "jit",
    },
  ],
  parsing: {
    allErrors: [
      {
        run(data, { schema }) {
          try {
            S.parseOrThrow(data, schema);
          } catch {}
        },
        snippet: ts`S.parseOrThrow(data, schema)`,
        throws: true,
      },
      {
        run(data, { compile }) {
          try {
            compile(data);
          } catch {}
        },
        snippet: ts`
        // const compile = S.compile(S.schema(...));
        compile(data);
      `,
        note: "compile",
        optimizeType: "jit",
        throws: true,
      },
      {
        run(data, { schema }) {
          return S.safe(() => S.parseOrThrow(data, schema));
        },
        snippet: ts`S.safe(() => S.parseOrThrow(data, schema))`,
        note: "safe",
      },
      {
        run(data, { compile }) {
          return S.safe(() => compile(data));
        },
        snippet: ts`
        // const compile = S.compile(S.schema(...));
        S.safe(() => compile(data));
      `,
        note: "compile + safe",
        optimizeType: "jit",
      },
    ],
  },
  stack: {
    throw: ({ schema }, data) => {
      S.parseOrThrow(data, schema);
      assertNotReached();
    },
    snippet: ts`S.parseOrThrow(data, schema)`,
  },
});
