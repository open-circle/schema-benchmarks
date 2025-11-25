import { defineBenchmarks } from "@schema-benchmarks/schemas";
import { getVersion } from "@schema-benchmarks/utils/node" with {
  type: "macro",
};
import ts from "dedent" with { type: "macro" };
import Value from "typebox/value";
import { getTypeboxSchema } from ".";

const schema = getTypeboxSchema();

export default defineBenchmarks({
  library: {
    name: "typebox",
    type: "runtime",
    version: await getVersion("typebox"),
  },
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
        try {
          Value.Parse(schema, data);
        } catch {}
      },
      snippet: ts`Value.Parse(schema, data)`,
    },
  },
});
