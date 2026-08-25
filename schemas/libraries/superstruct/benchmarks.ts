import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import { assert, is, validate } from "superstruct";

import { assertNotReached, defineBenchmarks } from "#src";

import { getSuperstructSchema } from ".";

const schema = getSuperstructSchema();

export default defineBenchmarks({
  library: {
    name: "superstruct",
    optimizeType: "none",
    version: await getVersion("superstruct"),
  },
  initialization: {
    run() {
      return getSuperstructSchema();
    },
    snippet: ts`object(...)`,
  },
  validation: [
    {
      run(data) {
        return is(data, schema);
      },
      snippet: ts`is(data, schema)`,
    },
    {
      run(data) {
        return schema.is(data);
      },
      snippet: ts`schema.is(data)`,
      note: "schema.is",
    },
  ],
  parsing: {
    abortEarly: [
      {
        run(data) {
          return validate(data, schema);
        },
        validateResult: ([error]) => !error,
        getData: ([, data]) => data,
        snippet: ts`validate(data, schema)`,
      },
      {
        run(data) {
          return schema.validate(data);
        },
        validateResult: ([error]) => !error,
        getData: ([, data]) => data,
        snippet: ts`schema.validate(data)`,
        note: "schema.validate",
      },
    ],
    allErrors: [
      {
        run(data) {
          const result = validate(data, schema);
          // oxlint-disable-next-line no-underscore-dangle
          for (const _failure of result[0]?.failures() ?? []) {
            // force iteration
          }
          return result;
        },
        validateResult: ([error]) => !error,
        getData: ([, data]) => data,
        snippet: ts`
          const [error] = validate(data, schema);
          for (const failure of error.failures()) {
            // ...
          }
        `,
      },
      {
        run(data) {
          const result = schema.validate(data);
          // oxlint-disable-next-line no-underscore-dangle
          for (const _failure of result[0]?.failures() ?? []) {
            // force iteration
          }
          return result;
        },
        validateResult: ([error]) => !error,
        getData: ([, data]) => data,
        snippet: ts`
          const [error] = schema.validate(data);
          for (const failure of error.failures()) {
            // ...
          }
        `,
        note: "schema.validate",
      },
    ],
  },
  stack: {
    throw: (data) => {
      assert(data, schema);
      assertNotReached();
    },
    snippet: ts`assert(data, schema)`,
  },
});
