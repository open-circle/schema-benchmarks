import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent" with { type: "macro" };

import { defineBenchmarks } from "#src";

import { getJoiSchema } from ".";

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
      getJoiSchema();
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
});
