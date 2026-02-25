import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import Joi from "joi";

import type { StringBenchmarkConfig } from "#src";
import { defineBenchmarks } from "#src";

import { getJoiSchema } from ".";

type FormatMethod = {
  [M in keyof Joi.StringSchema]-?: Joi.StringSchema[M] extends () => Joi.StringSchema ? M : never;
}[keyof Joi.StringSchema];

const createStringBenchmark = <Format extends FormatMethod>(
  method: Format,
  snippet = `${method}()`,
  ...args: Parameters<Joi.StringSchema[Format]>
): StringBenchmarkConfig<unknown> => ({
  create() {
    const schema = Joi.string()[method](...(args as []));
    return (testString) => !schema.validate(testString).error;
  },
  snippet: ts`Joi.string().${snippet}`,
});

export default defineBenchmarks({
  library: {
    name: "joi",
    git: "hapijs/joi",
    optimizeType: "none",
    version: await getVersion("joi"),
  },
  createContext: () => ({ schema: getJoiSchema() }),
  initialization: {
    run() {
      return getJoiSchema();
    },
    snippet: ts`object(...)`,
  },
  parsing: {
    allErrors: {
      run(data, { schema }) {
        return schema.validate(data, { abortEarly: false });
      },
      validateResult: (result) => !result.error,
      snippet: ts`schema.validate(data, { abortEarly: false })`,
    },
    abortEarly: {
      run(data, { schema }) {
        return schema.validate(data, { abortEarly: true });
      },
      validateResult: (result) => !result.error,
      snippet: ts`schema.validate(data, { abortEarly: true })`,
    },
  },
  standard: {
    allErrors: {
      getSchema: ({ schema }) => schema,
    },
  },
  string: {
    email: createStringBenchmark("email"),
    url: createStringBenchmark("uri"),
    uuid: createStringBenchmark("uuid"),
    ipv4: createStringBenchmark("ip", ts`ip({ version: "ipv4" })`, { version: "ipv4" }),
    ipv6: createStringBenchmark("ip", ts`ip({ version: "ipv6" })`, { version: "ipv6" }),
  },
});
