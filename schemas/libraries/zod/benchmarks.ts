import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import * as z from "zod";

import type { StringBenchmarkConfig } from "#src";
import { defineBenchmarks } from "#src";

import { getZodSchema } from ".";

const createStringBenchmark = (
  factory: () => z.ZodType<string>,
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
    name: "zod",
    git: "colinhacks/zod",
    optimizeType: "jit",
    version: await getVersion("zod"),
  },
  createContext: () => ({
    schema: getZodSchema(),
  }),
  initialization: {
    run() {
      return getZodSchema();
    },
    snippet: ts`z.object(...)`,
  },
  parsing: {
    allErrors: [
      {
        run(data, { schema }) {
          return schema.safeParse(data);
        },
        validateResult: (result) => result.success,
        snippet: ts`schema.safeParse(data)`,
      },
      {
        run(data, { schema }) {
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
