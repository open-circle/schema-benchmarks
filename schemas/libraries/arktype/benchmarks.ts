import { defineBenchmarks } from "@schema-benchmarks/schemas";
import ts from "dedent" with { type: "macro" };
import { getVersion } from "../../src/version" with { type: "macro" };
import { getArkTypeSchema } from ".";

const schema = getArkTypeSchema();

export default defineBenchmarks({
  libraryName: "arktype",
  libraryType: "runtime",
  libraryVersion: await getVersion("arktype"),
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
      snippet: ts`schema(data)`,
    },
  },
});
