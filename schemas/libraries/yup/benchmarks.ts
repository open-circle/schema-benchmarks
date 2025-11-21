import { defineBenchmarks } from "@schema-benchmarks/schemas";
import ts from "dedent";
import { getYupSchema } from ".";

const schema = getYupSchema();

export default defineBenchmarks({
  libraryName: "yup",
  libraryType: "runtime",
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
        schema.validateSync(data, { abortEarly: false });
      },
      snippet: ts`schema.validateSync(data, { abortEarly: false })`,
    },
    abortEarly: {
      run(data) {
        schema.validateSync(data, { abortEarly: true });
      },
      snippet: ts`schema.validateSync(data, { abortEarly: true })`,
    },
  },
});
