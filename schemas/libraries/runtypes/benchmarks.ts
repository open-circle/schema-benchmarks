import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";

import { assertNotReached, defineBenchmarks } from "#src";

import { getRuntypesSchema } from ".";

const schema = getRuntypesSchema();

export default defineBenchmarks({
  library: {
    name: "runtypes",
    git: "pelotom/runtypes",
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
          return schema.inspect(data).success;
        },
        validateResult: (result) => result,
        snippet: ts`schema.inspect(data)`,
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
  stack: {
    throw: (data) => {
      schema.check(data);
      assertNotReached();
    },
    snippet: ts`schema.check(data)`,
  },
});
