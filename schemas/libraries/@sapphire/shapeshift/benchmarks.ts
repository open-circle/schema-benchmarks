import { s, type StringValidator } from "@sapphire/shapeshift";
import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";

import type { StringBenchmarkConfig } from "#src";
import { assertNotReached, defineBenchmarks, success } from "#src";

import { getShapeshiftSchema } from ".";

type FormatMethod = {
  [
    K in keyof StringValidator<string>
  ]-?: StringValidator<string>[K] extends () => StringValidator<string> ? K : never;
}[keyof StringValidator<string>];

const createStringBenchmark = (method: FormatMethod): StringBenchmarkConfig => ({
  create() {
    // oxlint-disable-next-line typescript/no-unnecessary-type-assertion
    const schema = (s.string()[method] as () => StringValidator<string>)();
    return (testString) => schema.is(testString);
  },
  snippet: ts`s.string().${method}()`,
});

const schema = getShapeshiftSchema();

export default defineBenchmarks({
  library: {
    name: "@sapphire/shapeshift",
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
          try {
            return success.true(schema.parse(data));
          } catch {
            return success.false;
          }
        },
        validateResult: (result) => result.success,
        getData: (result) => result.value,
        snippet: ts`schema.parse(data)`,
        throws: true,
      },
      {
        run(data) {
          return schema.run(data);
        },
        validateResult: (result) => result.success,
        getData: (result) => result.value,
        snippet: ts`schema.run(data)`,
        note: "run",
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
