import { defineBenchmarks } from "@schema-benchmarks/schemas";
import ts from "dedent" with { type: "macro" };
import Value from "typebox/value";
import { getVersion } from "../../src/version" with { type: "macro" };
import { getTypeboxSchema } from ".";

const schema = getTypeboxSchema();

export default defineBenchmarks({
  libraryName: "typebox",
  libraryType: "runtime",
  libraryVersion: await getVersion("typebox"),
  initialization: {
    run() {
      getTypeboxSchema();
    },
    snippet: ts`Type.Object(...)`,
  },
  validation: {
    run(data) {
      Value.Check(schema, data);
    },
    snippet: ts`Value.Check(schema, data)`,
  },
  parsing: {
    allErrors: {
      run(data) {
        Value.Parse(schema, data);
      },
      snippet: ts`Value.Parse(schema, data)`,
    },
  },
});
