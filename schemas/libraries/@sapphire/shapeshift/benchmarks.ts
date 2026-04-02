import { s, type StringValidator } from "@sapphire/shapeshift";
import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";

import type { StringBenchmarkConfig } from "#src";
import { assertNotReached, defineBenchmarks } from "#src";

import { getShapeshiftSchema } from ".";

type FormatMethod = {
  [K in keyof StringValidator<string>]-?: StringValidator<string>[K] extends () => StringValidator<string>
    ? K
    : never;
}[keyof StringValidator<string>];

const createStringBenchmark = (method: FormatMethod): StringBenchmarkConfig => ({
  create() {
    const schema = (s.string()[method] as () => StringValidator<string>)();
    return (testString) => schema.is(testString);
  },
  snippet: ts`s.string().${method}()`,
});

const schema = getShapeshiftSchema();

export default defineBenchmarks({
  library: {
    name: "@sapphire/shapeshift",
    git: "sapphiredev/shapeshift",
    optimizeType: "none",
    version: await getVersion("@sapphire/shapeshift"),
  },
  initialization: {
    run() {
      return getShapeshiftSchema();
    },
    snippet: ts`s.object(...)`,
  },
  validation: {
    run(data) {
      return schema.is(data);
    },
    snippet: ts`schema.is(data)`,
  },
  parsing: {
    allErrors: [
      {
        run(data) {
          return schema.run(data).success;
        },
        validateResult: (result) => result,
        snippet: ts`schema.run(data)`,
        note: "run",
      },
      {
        run(data) {
          try {
            schema.parse(data);
            return true;
          } catch {
            return false;
          }
        },
        validateResult: (result) => result,
        snippet: ts`schema.parse(data)`,
        throws: true,
      },
    ],
  },
  string: {
    date: createStringBenchmark("date"),
    email: createStringBenchmark("email"),
    url: createStringBenchmark("url"),
    uuid: createStringBenchmark("uuid"),
    ipv4: createStringBenchmark("ipv4"),
    ipv6: createStringBenchmark("ipv6"),
  },
  stack: {
    throw: (data) => {
      schema.parse(data);
      assertNotReached();
    },
    snippet: ts`schema.parse(data)`,
  },
});
