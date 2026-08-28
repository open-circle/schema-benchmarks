import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import { parse, parseSafe } from "remix/data-schema";

import { assertNotReached, defineBenchmarks } from "#src";

import { getRemixSchema } from ".";

const schema = getRemixSchema();

export default defineBenchmarks({
  library: {
    name: "remix/data-schema",
    optimizeType: "none",
    version: await getVersion("remix"),
  },
  initialization: {
    run() {
      return getRemixSchema();
    },
    snippet: ts`object(...)`,
  },
  parsing: {
    allErrors: {
      run(data) {
        return parseSafe(schema, data);
      },
      validateResult: (result) => result.success,
      getData: (result) => (result.success ? result.value : undefined),
      snippet: ts`parseSafe(schema, data)`,
    },
    abortEarly: {
      run(data) {
        return parseSafe(schema, data, { abortEarly: true });
      },
      validateResult: (result) => result.success,
      getData: (result) => (result.success ? result.value : undefined),
      snippet: ts`parseSafe(schema, data, { abortEarly: true })`,
    },
  },
  standard: {
    allErrors: { schema },
  },
  stack: {
    throw(data) {
      parse(schema, data);
      assertNotReached();
    },
    snippet: ts`parse(schema, data)`,
  },
});
