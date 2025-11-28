import { defineBenchmarks } from "@schema-benchmarks/schemas";
import { getVersion } from "@schema-benchmarks/utils/node" with {
  type: "macro",
};
import ts from "dedent" with { type: "macro" };
import * as v from "valibot";
import { getValibotSchema } from ".";

export default defineBenchmarks({
  library: {
    name: "valibot",
    type: "runtime",
    version: await getVersion("valibot"),
  },
  createContext: () => ({ schema: getValibotSchema() }),
  initialization: {
    run() {
      getValibotSchema();
    },
    snippet: ts`v.object(...)`,
  },
  validation: {
    run(data, { schema }) {
      v.is(schema, data);
    },
    snippet: ts`v.is(schema, data)`,
  },
  parsing: {
    allErrors: {
      run(data, { schema }) {
        v.safeParse(schema, data);
      },
      snippet: ts`v.safeParse(schema, data)`,
    },
    abortEarly: [
      {
        run(data, { schema }) {
          v.safeParse(schema, data, { abortEarly: true });
        },
        snippet: ts`v.safeParse(schema, data, { abortEarly: true })`,
      },
      {
        run(data, { schema }) {
          v.safeParse(schema, data, { abortPipeEarly: true });
        },
        snippet: ts`v.safeParse(schema, data, { abortPipeEarly: true })`,
        note: "abortPipeEarly only",
      },
    ],
  },
});
