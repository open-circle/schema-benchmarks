import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent" with { type: "macro" };
import * as yup from "yup";

import { defineBenchmarks } from "#src";

import { getYupSchema } from ".";

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
    email: {
      create() {
        const schema = yup.string().email();
        return (testString) => schema.isValidSync(testString);
      },
      snippet: ts`yup.string().email()`,
    },
    url: {
      create() {
        const schema = yup.string().url();
        return (testString) => schema.isValidSync(testString);
      },
      snippet: ts`yup.string().url()`,
    },
    uuid: {
      create() {
        const schema = yup.string().uuid();
        return (testString) => schema.isValidSync(testString);
      },
      snippet: ts`yup.string().uuid()`,
    },
  },
});
