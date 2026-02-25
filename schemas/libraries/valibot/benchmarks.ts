import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import * as v from "valibot";

import type { StringBenchmarkConfig } from "#src";
import { defineBenchmarks } from "#src";

import { getValibotSchema } from ".";

const createStringBenchmark = (
  actionFactory: () => v.GenericValidation<string>,
  snippet: string,
): StringBenchmarkConfig<unknown> => ({
  create() {
    const schema = v.pipe(v.string(), actionFactory());
    return (testString) => v.is(schema, testString);
  },
  snippet: ts`v.pipe(v.string(), ${snippet})`,
});

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
    "date-time": createStringBenchmark(v.isoDateTime, ts`v.isoDateTime()`),
    date: createStringBenchmark(v.isoDate, ts`v.isoDate()`),
    time: createStringBenchmark(v.isoTime, ts`v.isoTime()`),
    email: createStringBenchmark(v.email, ts`v.email()`),
    url: createStringBenchmark(v.url, ts`v.url()`),
    uuid: createStringBenchmark(v.uuid, ts`v.uuid()`),
    ipv4: createStringBenchmark(v.ipv4, ts`v.ipv4()`),
    ipv6: createStringBenchmark(v.ipv6, ts`v.ipv6()`),
  },
});
