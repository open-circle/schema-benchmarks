import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import * as yup from "yup";

import type { StringBenchmarkConfig } from "#src";
import { defineBenchmarks } from "#src";

import { getYupSchema } from ".";

type FormatMethod = {
  [M in keyof yup.StringSchema]-?: yup.StringSchema[M] extends () => yup.StringSchema ? M : never;
}[keyof yup.StringSchema];

const createStringBenchmark = (method: FormatMethod): StringBenchmarkConfig<unknown> => ({
  create() {
    const schema = yup.string()[method]();
    return (testString) => schema.isValidSync(testString);
  },
  snippet: ts`yup.string().${method}()`,
});

export default defineBenchmarks({
  library: {
    name: "yup",
    git: "jquense/yup",
    optimizeType: "none",
    version: await getVersion("yup"),
  },
  createContext: () => ({ schema: getYupSchema() }),
  initialization: {
    run() {
      return getYupSchema();
    },
    snippet: ts`object(...)`,
  },
  validation: {
    run(data, { schema }) {
      return schema.isValidSync(data);
    },
    snippet: ts`schema.isValidSync(data)`,
  },
  parsing: {
    allErrors: {
      run(data, { schema }) {
        try {
          schema.validateSync(data, { abortEarly: false });
          return true;
        } catch {
          return false;
        }
      },
      validateResult: (result) => result,
      snippet: ts`schema.validateSync(data, { abortEarly: false })`,
      throws: true,
    },
    abortEarly: {
      run(data, { schema }) {
        try {
          schema.validateSync(data, { abortEarly: true });
          return true;
        } catch {}
        return false;
      },
      validateResult: (result) => result,
      snippet: ts`schema.validateSync(data, { abortEarly: true })`,
      throws: true,
    },
  },
  standard: {
    allErrors: {
      getSchema: ({ schema }) => schema,
    },
  },
  string: {
    "date-time": createStringBenchmark("datetime"),
    email: createStringBenchmark("email"),
    url: createStringBenchmark("url"),
    uuid: createStringBenchmark("uuid"),
  },
});
