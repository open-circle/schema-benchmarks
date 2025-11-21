import { defineBenchmarks } from "@schema-benchmarks/schemas";
import ts from "dedent";
import * as v from "valibot";
import { getValibotSchema } from ".";

const schema = getValibotSchema();

export default defineBenchmarks({
  libraryName: "valibot",
  libraryType: "runtime",
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
    abortEarly: {
      run(data) {
        v.safeParse(schema, data, { abortEarly: true });
      },
      snippet: ts`v.safeParse(schema, data, { abortEarly: true })`,
    },
  },
});
