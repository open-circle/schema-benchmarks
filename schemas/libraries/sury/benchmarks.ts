import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import * as S from "sury";

import type { StringBenchmarkConfig } from "#src";
import { assertNotReached, defineBenchmarks } from "#src";

import { getSurySchema } from ".";

const createStringBenchmark = (
  schema: S.Schema<string>,
  snippet: string,
): StringBenchmarkConfig => ({
  create() {
    const parser = S.parser(schema);
    return (testString) => S.safe(() => parser(testString)).success;
  },
  snippet,
});

const schema = getSurySchema();
const parser = S.parser(getSurySchema());

export default defineBenchmarks({
  library: {
    name: "sury",
    git: "DZakh/sury",
    optimizeType: "jit",
    version: await getVersion("sury"),
  },
  initialization: [
    {
      run() {
        return getSurySchema();
      },
      snippet: ts`S.schema(...)`,
    },
    {
      run() {
        return S.parser(getSurySchema());
      },
      snippet: ts`S.parser(S.schema(...))`,
      note: "parser",
      optimizeType: "jit",
    },
  ],
  parsing: {
    allErrors: [
      {
        run(data) {
          try {
            parser(data);
            return { success: true };
          } catch {
            return { success: false };
          }
        },
        validateResult: (result) => result.success,
        snippet: ts`
        // const parser = S.parser(S.schema(...));
        parser(data);
      `,
        optimizeType: "jit",
        throws: true,
      },
      {
        run(data) {
          return S.safe(() => parser(data));
        },
        validateResult: (result) => result.success,
        snippet: ts`S.safe(() => parser(data))`,
        note: "safe",
      },
    ],
  },
  standard: {
    allErrors: { schema },
  },
  string: {
    "date-time": createStringBenchmark(S.isoDateTime, ts`S.isoDateTime`),
    email: createStringBenchmark(S.email, ts`S.email`),
    url: createStringBenchmark(S.url, ts`S.url`),
    uuid: createStringBenchmark(S.uuid, ts`S.uuid`),
  },
  stack: {
    throw: (data) => {
      parser(data);
      assertNotReached();
    },
    snippet: ts`
    // const parser = S.parser(S.schema(...));
    parser(data)
    `,
  },
});
