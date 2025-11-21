import { defineBenchmarks } from "@schema-benchmarks/schemas";
import ts from "dedent" with { type: "macro" };
import * as v from "valibot";
import { getVersion } from "../../src/version" with { type: "macro" };
import { getValibotSchema } from ".";

const schema = getValibotSchema();

export default defineBenchmarks({
  libraryName: "valibot",
  libraryType: "runtime",
  libraryVersion: await getVersion("valibot"),
  initialization: {
    run() {
      getValibotSchema();
    },
    snippet: ts`v.object(...)`,
  },
  validation: {
    run(data) {
      v.is(schema, data);
    },
    snippet: ts`v.is(schema, data)`,
  },
  parsing: {
    allErrors: {
      run(data) {
        v.safeParse(schema, data);
      },
      snippet: ts`v.safeParse(schema, data)`,
    },
    abortEarly: [
      {
        run(data) {
          v.safeParse(schema, data, { abortEarly: true });
        },
        snippet: ts`v.safeParse(schema, data, { abortEarly: true })`,
      },
      {
        run(data) {
          v.safeParse(schema, data, { abortPipeEarly: true });
        },
        snippet: ts`v.safeParse(schema, data, { abortPipeEarly: true })`,
        note: "abortPipeEarly only",
      },
    ],
  },
});
