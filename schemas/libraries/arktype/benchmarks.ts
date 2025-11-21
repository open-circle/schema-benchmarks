import { defineBenchmarks } from "@schema-benchmarks/schemas";
import ts from "dedent";
import { getArkTypeSchema } from ".";

const schema = getArkTypeSchema();

export default defineBenchmarks({
  libraryName: "arktype",
  libraryType: "runtime",
  initialization: {
    run() {
      getArkTypeSchema();
    },
    snippet: ts`type(...)`,
  },
  validation: {
    run(data) {
      schema.allows(data);
    },
    snippet: ts`schema.allows(data)`,
  },
  parsing: {
    allErrors: {
      run(data) {
        schema(data);
      },
      snippet: ts`schema.parse(data)`,
    },
  },
});
