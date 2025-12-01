import { defineBenchmarks } from "@schema-benchmarks/schemas";
import { getVersion } from "@schema-benchmarks/utils/node" with {
  type: "macro",
};
import ts from "dedent" with { type: "macro" };
import * as v from "valibot";
import { getValibotSchema } from ".";

// results are returned to avoid benchmark body being tree-shaken out

export default defineBenchmarks({
  library: {
    name: "valibot",
    optimizeType: "runtime",
    version: await getVersion("valibot"),
  },
  createContext: () => ({ schema: getValibotSchema() }),
  initialization: {
    run() {
      return getValibotSchema();
    },
    snippet: ts`v.object(...)`,
  },
  validation: {
    run(data, { schema }) {
      return v.is(schema, data);
    },
    snippet: ts`v.is(schema, data)`,
  },
  parsing: {
    allErrors: {
      run(data, { schema }) {
        return v.safeParse(schema, data);
      },
      snippet: ts`v.safeParse(schema, data)`,
    },
    abortEarly: [
      {
        run(data, { schema }) {
          return v.safeParse(schema, data, { abortEarly: true });
        },
        snippet: ts`v.safeParse(schema, data, { abortEarly: true })`,
      },
      {
        run(data, { schema }) {
          return v.safeParse(schema, data, { abortPipeEarly: true });
        },
        snippet: ts`v.safeParse(schema, data, { abortPipeEarly: true })`,
        note: "abortPipeEarly only",
      },
    ],
  },
});
