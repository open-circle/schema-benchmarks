import { defineBenchmarks } from "@schema-benchmarks/schemas";
import { getVersion } from "@schema-benchmarks/utils/node" with {
  type: "macro",
};
import ts from "dedent" with { type: "macro" };
import { getJoiSchema } from ".";

export default defineBenchmarks({
  library: {
    name: "joi",
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
  validation: {
    run(data, { schema }) {
      schema.validate(data);
    },
    snippet: ts`schema.validate(data)`,
  },
  parsing: {
    allErrors: {
      run(data, { schema }) {
        schema.validate(data, { abortEarly: false });
      },
      snippet: ts`schema.validate(data, { abortEarly: false })`,
    },
    abortEarly: {
      run(data, { schema }) {
        schema.validate(data, { abortEarly: true });
      },
      snippet: ts`schema.validate(data, { abortEarly: true })`,
    },
  },
});
