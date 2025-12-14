import { defineBenchmarks } from "@schema-benchmarks/schemas";
import { getVersion } from "@schema-benchmarks/utils/node" with {
  type: "macro",
};
import ts from "dedent" with { type: "macro" };
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
      getYupSchema();
    },
    snippet: ts`object(...)`,
  },
  validation: {
    run(data, { schema }) {
      schema.isValidSync(data);
    },
    snippet: ts`schema.isValidSync(data)`,
  },
  parsing: {
    allErrors: {
      run(data, { schema }) {
        try {
          schema.validateSync(data, { abortEarly: false });
        } catch {}
      },
      snippet: ts`schema.validateSync(data, { abortEarly: false })`,
    },
    abortEarly: {
      run(data, { schema }) {
        try {
          schema.validateSync(data, { abortEarly: true });
        } catch {}
      },
      snippet: ts`schema.validateSync(data, { abortEarly: true })`,
    },
  },
});
