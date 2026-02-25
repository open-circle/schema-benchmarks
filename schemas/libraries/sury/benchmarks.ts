import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import * as S from "sury";

import type { StringBenchmarkConfig } from "#src";
import { defineBenchmarks } from "#src";

import { getSurySchema } from ".";

const createStringBenchmark = (
  modifier: (string: typeof S.string) => S.Schema<unknown>,
  snippet: string,
): StringBenchmarkConfig<unknown> => ({
  create() {
    const schema = modifier(S.string);
    return (testString) => S.safe(() => S.parseOrThrow(testString, schema)).success;
  },
  snippet,
});

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
        return getSurySchema();
      },
      snippet: ts`S.schema(...)`,
    },
    {
      run() {
        return S.compile(getSurySchema(), "Any", "Output", "Sync");
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
            return { success: true };
          } catch {
            return { success: false };
          }
        },
        validateResult: (result) => result.success,
        snippet: ts`S.parseOrThrow(data, schema)`,
        throws: true,
      },
      {
        run(data, { compile }) {
          try {
            compile(data);
            return { success: true };
          } catch {
            return { success: false };
          }
        },
        validateResult: (result) => result.success,
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
        validateResult: (result) => result.success,
        snippet: ts`S.safe(() => S.parseOrThrow(data, schema))`,
        note: "safe",
      },
      {
        run(data, { compile }) {
          return S.safe(() => compile(data));
        },
        validateResult: (result) => result.success,
        snippet: ts`
        // const compile = S.compile(S.schema(...));
        S.safe(() => compile(data));
      `,
        note: "compile + safe",
        optimizeType: "jit",
      },
    ],
  },
  standard: {
    allErrors: {
      getSchema: ({ schema }) => schema,
    },
  },
  string: {
    "date-time": createStringBenchmark(S.datetime, ts`S.datetime(S.string)`),
    email: createStringBenchmark(S.email, ts`S.email(S.string)`),
    url: createStringBenchmark(S.url, ts`S.url(S.string)`),
    uuid: createStringBenchmark(S.uuid, ts`S.uuid(S.string)`),
  },
});
