import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";

import { assertNotReached, defineBenchmarks, success } from "#src";

import { getRuntypesSchema } from ".";

const schema = getRuntypesSchema();

export default defineBenchmarks({
  library: {
    name: "runtypes",
    optimizeType: "none",
    version: await getVersion("runtypes"),
  },
  initialization: {
    run() {
      return getRuntypesSchema();
    },
    snippet: ts`Object({...})`,
  },
  validation: {
    run(data) {
      return schema.guard(data);
    },
    snippet: ts`schema.guard(data)`,
  },
  parsing: {
    abortEarly: [
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
          return schema.inspect(data);
        },
        validateResult: (result) => result.success,
        getData: (result) => result.value,
        snippet: ts`schema.inspect(data)`,
      },
    ],
  },
  stack: {
    throw: (data) => {
      schema.check(data);
      assertNotReached();
    },
    snippet: ts`schema.check(data)`,
  },
});
