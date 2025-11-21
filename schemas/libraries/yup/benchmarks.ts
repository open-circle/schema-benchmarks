import { defineBenchmarks } from "@schema-benchmarks/schemas";
import ts from "dedent" with { type: "macro" };
import { getVersion } from "../../src/version" with { type: "macro" };
import { getYupSchema } from ".";

const schema = getYupSchema();

export default defineBenchmarks({
  libraryName: "yup",
  libraryType: "runtime",
  libraryVersion: await getVersion("yup"),
  initialization: {
    run() {
      getYupSchema();
    },
    snippet: ts`object(...)`,
  },
  validation: {
    run(data) {
      schema.isValidSync(data);
    },
    snippet: ts`schema.isValidSync(data)`,
  },
  parsing: {
    allErrors: {
      run(data) {
        try {
          schema.validateSync(data, { abortEarly: false });
        } catch {}
      },
      snippet: ts`schema.validateSync(data, { abortEarly: false })`,
    },
    abortEarly: {
      run(data) {
        try {
          schema.validateSync(data, { abortEarly: true });
        } catch {}
      },
      snippet: ts`schema.validateSync(data, { abortEarly: true })`,
    },
  },
});
