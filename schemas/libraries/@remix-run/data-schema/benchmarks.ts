import { parse, parseSafe } from "@remix-run/data-schema";
import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";

import { assertNotReached, defineBenchmarks } from "#src";

import { getRemixSchema } from ".";

const schema = getRemixSchema();

export default defineBenchmarks({
  library: {
    name: "@remix-run/data-schema",
    optimizeType: "none",
    version: await getVersion("@remix-run/data-schema"),
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
