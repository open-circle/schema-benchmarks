import type { Validator } from "@railway-ts/pipelines/schema";
import {
  is,
  validate,
  toStandardSchema,
  chain,
  string,
  email,
  url,
  uuid,
  isoDate,
  isoTime,
  isoDateTime,
  isoDuration,
} from "@railway-ts/pipelines/schema";
import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";

import type { StringBenchmarkConfig } from "#src";
import { defineBenchmarks } from "#src";

import { getRailwayTsSchema } from ".";

const createStringBenchmark = (
  factory: () => Validator<string>,
  snippet: string,
): StringBenchmarkConfig<unknown> => ({
  create() {
    const schema = chain(string(), factory());
    return (testString) => is(testString, schema);
  },
  snippet: ts`chain(string(), ${snippet})`,
});

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
    "date-time": createStringBenchmark(isoDateTime, "isoDateTime()"),
    date: createStringBenchmark(isoDate, "isoDate()"),
    time: createStringBenchmark(isoTime, "isoTime()"),
    duration: createStringBenchmark(isoDuration, "duration()"),
    email: createStringBenchmark(email, "email()"),
    url: createStringBenchmark(url, "url()"),
    uuid: createStringBenchmark(uuid, "uuid()"),
  },
});
