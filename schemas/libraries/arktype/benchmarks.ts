import { defineBenchmarks } from "@schema-benchmarks/schemas";
import { getVersion } from "@schema-benchmarks/utils" with { type: "macro" };
import ts from "dedent" with { type: "macro" };
import { getArkTypeSchema } from ".";

const schema = getArkTypeSchema();

export default defineBenchmarks({
  library: {
    name: "arktype",
    type: "runtime",
    version: await getVersion("arktype"),
  },
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
