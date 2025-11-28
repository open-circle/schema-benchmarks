import { defineBenchmarks } from "@schema-benchmarks/schemas";
import { getVersion } from "@schema-benchmarks/utils/node" with {
  type: "macro",
};
import ts from "dedent" with { type: "macro" };
import Value from "typebox/value";
import { getTypeboxSchema } from ".";

export default defineBenchmarks({
  library: {
    name: "typebox",
    type: "runtime",
    version: await getVersion("typebox"),
  },
  createContext: () => ({ schema: getTypeboxSchema() }),
  initialization: {
    run() {
      getTypeboxSchema();
    },
    snippet: ts`Type.Object(...)`,
  },
  validation: {
    run(data, { schema }) {
      Value.Check(schema, data);
    },
    snippet: ts`Value.Check(schema, data)`,
  },
  parsing: {
    allErrors: {
      run(data, { schema }) {
        try {
          Value.Parse(schema, data);
        } catch {}
      },
      snippet: ts`Value.Parse(schema, data)`,
    },
  },
});
