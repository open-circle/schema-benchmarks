import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import * as z from "zod/v3";

import type { StringBenchmarkConfig } from "#src";
import { assertNotReached, defineBenchmarks } from "#src";

import { getZodSchema } from ".";

type FormatMethod = {
  [K in keyof z.ZodString]-?: z.ZodString[K] extends () => z.ZodString ? K : never;
}[keyof z.ZodString];

const createStringBenchmark = <Method extends FormatMethod>(
  method: Method,
  snippet = `${method}()`,
  ...args: Parameters<z.ZodString[Method]>
): StringBenchmarkConfig => ({
  create() {
    const schema = z.string()[method](...(args as []));
    return (testString) => schema.safeParse(testString).success;
  },
  snippet: ts`z.string().${snippet}`,
});

const schema = getZodSchema();

export default defineBenchmarks({
  library: {
    name: "zod/v3",
    git: "colinhacks/zod",
    optimizeType: "none",
    version: await getVersion("zod"),
  },
  initialization: {
    run() {
      return getZodSchema();
    },
    snippet: ts`z.object(...)`,
  },
  parsing: {
    allErrors: [
      {
        run(data) {
          return schema.safeParse(data);
        },
        validateResult: (result) => result.success,
        snippet: ts`schema.safeParse(data)`,
      },
    ],
  },
  standard: {
    allErrors: { schema },
  },
  string: {
    "date-time": createStringBenchmark("datetime"),
    date: createStringBenchmark("date"),
    // doesn't allow offset
    // time: createStringBenchmark("time"),
    duration: createStringBenchmark("duration"),
    email: createStringBenchmark("email"),
    url: createStringBenchmark("url"),
    uuid: createStringBenchmark("uuid"),
    ipv4: createStringBenchmark("ip", ts`ip({ version: "v4" })`, { version: "v4" }),
    ipv6: createStringBenchmark("ip", ts`ip({ version: "v6" })`, { version: "v6" }),
  },
  stack: {
    throw: (data) => {
      schema.parse(data);
      assertNotReached();
    },
    snippet: ts`schema.parse(data)`,
  },
});
