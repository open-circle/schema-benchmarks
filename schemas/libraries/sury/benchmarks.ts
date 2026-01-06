import { defineBenchmarks } from "@schema-benchmarks/schemas";
import { getVersion } from "@schema-benchmarks/utils/node" with {
  type: "macro",
};
import ts from "dedent" with { type: "macro" };
import * as S from "sury";
import { getSurySchema } from ".";

export default defineBenchmarks({
  library: {
    name: "sury",
    git: "DZakh/sury",
    optimizeType: "jit",
    version: await getVersion("sury"),
  },
  createContext: () => ({ schema: getSurySchema() }),
  initialization: {
    run() {
      getSurySchema();
    },
    snippet: ts`S.schema(...)`,
  },
  parsing: {
    allErrors: {
      run(data, { schema }) {
        try {
          S.parseOrThrow(data, schema);
        } catch {}
      },
      snippet: ts`S.parseOrThrow(data, schema)`,
    },
  },
});
