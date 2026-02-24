import {
  is,
  validate,
  toStandardSchema,
  chain,
  string,
  email,
  url,
} from "@railway-ts/pipelines/schema";
import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";

import { defineBenchmarks } from "#src";

import { getRailwayTsSchema } from ".";

export default defineBenchmarks({
  library: {
    name: "@railway-ts/pipelines",
    git: "sakobu/railway-ts-pipelines",
    optimizeType: "none",
    version: await getVersion("@railway-ts/pipelines"),
  },
  createContext: () => ({ schema: getRailwayTsSchema() }),
  initialization: {
    run() {
      return getRailwayTsSchema();
    },
    snippet: ts`object(...)`,
  },
  validation: {
    run(data, { schema }) {
      return is(data, schema);
    },
    snippet: ts`is(data, schema)`,
  },
  parsing: {
    allErrors: {
      run(data, { schema }) {
        return validate(data, schema);
      },
      validateResult: (result) => result.ok,
      snippet: ts`validate(data, schema)`,
    },
    abortEarly: {
      run(data, { schema }) {
        return validate(data, schema, { abortEarly: true });
      },
      validateResult: (result) => result.ok,
      snippet: ts`validate(data, schema, { abortEarly: true })`,
    },
  },
  standard: {
    allErrors: {
      getSchema: ({ schema }) => toStandardSchema(schema),
    },
  },
  string: {
    email: {
      create() {
        const schema = chain(string(), email());
        return (testString) => is(testString, schema);
      },
      snippet: ts`chain(string(), email())`,
    },
    url: {
      create() {
        const schema = chain(string(), url());
        return (testString) => is(testString, schema);
      },
      snippet: ts`chain(string(), url())`,
    },
  },
});
