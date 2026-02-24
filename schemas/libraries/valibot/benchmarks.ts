import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import * as v from "valibot";

import { defineBenchmarks } from "#src";

import { getValibotSchema } from ".";

export default defineBenchmarks({
  library: {
    name: "valibot",
    git: "open-circle/valibot",
    optimizeType: "none",
    version: await getVersion("valibot"),
  },
  createContext: () => ({ schema: getValibotSchema() }),
  initialization: {
    run() {
      return getValibotSchema();
    },
    snippet: ts`v.object(...)`,
  },
  validation: {
    run(data, { schema }) {
      return v.is(schema, data);
    },
    snippet: ts`v.is(schema, data)`,
  },
  parsing: {
    allErrors: {
      run(data, { schema }) {
        return v.safeParse(schema, data);
      },
      validateResult: (result) => result.success,
      snippet: ts`v.safeParse(schema, data)`,
    },
    abortEarly: [
      {
        run(data, { schema }) {
          return v.safeParse(schema, data, { abortEarly: true });
        },
        validateResult: (result) => result.success,
        snippet: ts`v.safeParse(schema, data, { abortEarly: true })`,
      },
      {
        run(data, { schema }) {
          return v.safeParse(schema, data, { abortPipeEarly: true });
        },
        validateResult: (result) => result.success,
        snippet: ts`v.safeParse(schema, data, { abortPipeEarly: true })`,
        note: "abortPipeEarly only",
      },
    ],
  },
  standard: {
    allErrors: {
      getSchema: ({ schema }) => schema,
    },
  },
  string: {
    email: {
      create() {
        const schema = v.pipe(v.string(), v.email());
        return (testString) => v.is(schema, testString);
      },
      snippet: ts`v.pipe(v.string(), v.email())`,
    },
    url: {
      create() {
        const schema = v.pipe(v.string(), v.url());
        return (testString) => v.is(schema, testString);
      },
      snippet: ts`v.pipe(v.string(), v.url())`,
    },
    uuid: {
      create() {
        const schema = v.pipe(v.string(), v.uuid());
        return (testString) => v.is(schema, testString);
      },
      snippet: ts`v.pipe(v.string(), v.uuid())`,
    },
  },
});
