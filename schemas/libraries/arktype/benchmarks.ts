import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import { type } from "arktype";
import ts from "dedent";

import type { StringBenchmarkConfig } from "#src";
import { assertNotReached, defineBenchmarks } from "#src";

import { getArkTypeSchema } from ".";

type Format =
  | Exclude<keyof typeof type.keywords.string, ` ${string}`>
  | `ip.v${4 | 6}`
  | "date.iso";

const createStringBenchmark = (format: Format): StringBenchmarkConfig => ({
  create() {
    return type(`string.${format}`).allows;
  },
  snippet: ts`type("string.${format}")`,
});

const schema = getArkTypeSchema();

export default defineBenchmarks({
  library: {
    name: "arktype",
    git: "arktypeio/arktype",
    optimizeType: "jit",
    version: await getVersion("arktype"),
  },
  initialization: {
    run() {
      return getArkTypeSchema();
    },
    snippet: ts`type(...)`,
  },
  validation: {
    run(data) {
      return schema.allows(data);
    },
    snippet: ts`schema.allows(data)`,
  },
  parsing: {
    allErrors: {
      run(data) {
        return schema(data);
      },
      validateResult: (result) => !(result instanceof type.errors),
      snippet: ts`schema(data)`,
    },
  },
  standard: {
    allErrors: {
      getSchema: () => schema,
    },
  },
  string: {
    "date-time": createStringBenchmark("date.iso"),
    email: createStringBenchmark("email"),
    url: createStringBenchmark("url"),
    uuid: createStringBenchmark("uuid"),
    ipv4: createStringBenchmark("ip.v4"),
    ipv6: createStringBenchmark("ip.v6"),
  },
  stack: {
    throw: (data) => {
      schema.assert(data);
      assertNotReached();
    },
    snippet: ts`schema.assert(data)`,
  },
});
