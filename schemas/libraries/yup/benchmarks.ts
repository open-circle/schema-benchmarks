import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import * as yup from "yup";

import type { StringBenchmarkConfig } from "#src";
import { assertNotReached, defineBenchmarks } from "#src";

import { getYupSchema } from ".";

type FormatMethod = {
  [M in keyof yup.StringSchema]-?: yup.StringSchema[M] extends () => yup.StringSchema ? M : never;
}[keyof yup.StringSchema];

const createStringBenchmark = (method: FormatMethod): StringBenchmarkConfig => ({
  create() {
    const schema = yup.string()[method]();
    return (testString) => schema.isValidSync(testString);
  },
  snippet: ts`yup.string().${method}()`,
});

const schema = getYupSchema();

export default defineBenchmarks({
  library: {
    name: "yup",
    git: "jquense/yup",
    optimizeType: "none",
    version: await getVersion("yup"),
  },
  initialization: {
    run() {
      return getYupSchema();
    },
    snippet: ts`object(...)`,
  },
  validation: {
    run(data) {
      return schema.isValidSync(data);
    },
    snippet: ts`schema.isValidSync(data)`,
  },
  parsing: {
    allErrors: {
      run(data) {
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
      run(data) {
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
    allErrors: { schema },
  },
  string: {
    "date-time": createStringBenchmark("datetime"),
    email: createStringBenchmark("email"),
    url: createStringBenchmark("url"),
    uuid: createStringBenchmark("uuid"),
  },
  stack: {
    throw: (data) => {
      schema.validateSync(data);
      assertNotReached();
    },
    snippet: ts`schema.validateSync(data)`,
  },
});
