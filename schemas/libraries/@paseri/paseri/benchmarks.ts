import * as p from "@paseri/paseri";
import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";

import type { StringBenchmarkConfig } from "#src";
import { assertNotReached, defineBenchmarks } from "#src";

import { getPaseriSchema } from ".";

const createStringBenchmark = (
  schema: p.Schema<string>,
  snippet: string,
): StringBenchmarkConfig => ({
  create() {
    return (testString) => schema.safeParse(testString).ok;
  },
  snippet,
});

const schema = getPaseriSchema();

export default defineBenchmarks({
  library: {
    name: "@paseri/paseri",
    optimizeType: "none",
    version: await getVersion("@paseri/paseri"),
  },
  initialization: {
    run() {
      return getPaseriSchema();
    },
    snippet: ts`p.object(...)`,
  },
  validation: {
    run(data) {
      return schema.safeParse(data).ok;
    },
    snippet: ts`p.object(...).safeParse(data).ok`,
  },
  parsing: {
    allErrors: [
      {
        run(data) {
          try {
            schema.parse(data);
            return { ok: true };
          } catch {
            return { ok: false };
          }
        },
        validateResult: (result) => result.ok,
        snippet: ts`p.object(...).parse(data)`,
        note: "parse",
        throws: true,
      },
      {
        run(data) {
          return { ok: schema.safeParse(data).ok };
        },
        validateResult: (result) => result.ok,
        snippet: ts`p.object(...).safeParse(data)`,
        note: "safeParse",
      },
    ],
  },
  standard: {
    allErrors: { schema },
  },
  string: {
    "date-time": createStringBenchmark(p.string().datetime(), ts`p.string().datetime()`),
    date: createStringBenchmark(p.string().date(), ts`p.string().date()`),
    time: createStringBenchmark(p.string().time(), ts`p.string().time()`),
    email: createStringBenchmark(p.string().email(), ts`p.string().email()`),
    url: createStringBenchmark(p.string().url(), ts`p.string().url()`),
    uuid: createStringBenchmark(p.string().uuid(), ts`p.string().uuid()`),
    ipv4: createStringBenchmark(p.string().ip({ version: 4 }), ts`p.string().ip({ version: 4 })`),
    ipv6: createStringBenchmark(p.string().ip({ version: 6 }), ts`p.string().ip({ version: 6 })`),
  },
  stack: {
    throw: (data) => {
      schema.parse(data);
      assertNotReached();
    },
    snippet: ts`p.object(...).parse(data)`,
  },
});
