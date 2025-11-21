import { defineBenchmarks } from "@schema-benchmarks/schemas";
import { getVersion } from "@schema-benchmarks/utils" with { type: "macro" };
import ts from "dedent" with { type: "macro" };
// import { getTemplateSchema } from ".";

// const schema = getTemplateSchema();

export default defineBenchmarks({
  library: {
    name: "__libraryName__",
    type: "runtime",
    version: await getVersion("__libraryName__"),
  },
  initialization: {
    run() {
      // getTemplateSchema();
    },
    snippet: ts`template(...)`,
  },
  validation: {
    run(data) {
      // schema.isValid(data);
    },
    snippet: ts`schema.isValid(data)`,
  },
  parsing: {
    allErrors: {
      run(data) {
        // schema.parse(data);
      },
      snippet: ts`schema.parse(data)`,
    },
    abortEarly: {
      run(data) {
        // schema.parse(data, { abortEarly: true });
      },
      snippet: ts`schema.parse(data, { abortEarly: true })`,
    },
  },
});
