import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import * as z from "zod/mini";

import type { StringBenchmarkConfig } from "#src";
import { defineBenchmarks } from "#src";

import { getZodMiniSchema } from ".";

const createStringBenchmark = (
  factory: () => z.ZodMiniType<string>,
  snippet: string,
): StringBenchmarkConfig<unknown> => ({
  create() {
    const schema = factory();
    return (testString) => schema.safeParse(testString).success;
  },
  snippet,
});

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
  string: {
    "date-time": createStringBenchmark(z.iso.datetime, ts`z.iso.datetime()`),
    date: createStringBenchmark(z.iso.date, ts`z.iso.date()`),
    // doesn't allow offset
    // time: createStringBenchmark(z.iso.time, ts`z.iso.time()`),
    email: createStringBenchmark(z.email, ts`z.email()`),
    url: createStringBenchmark(z.url, ts`z.url()`),
    uuid: createStringBenchmark(z.uuid, ts`z.uuid()`),
    ipv4: createStringBenchmark(z.ipv4, ts`z.ipv4()`),
    ipv6: createStringBenchmark(z.ipv6, ts`z.ipv6()`),
  },
});
