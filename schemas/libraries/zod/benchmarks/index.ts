import { defineBenchmarks } from "@schema-benchmarks/schemas";
import ts from "dedent";
import { getZodSchema } from "..";

const schema = getZodSchema();

export default defineBenchmarks({
  libraryName: "zod",
  libraryType: "runtime",
  initialization: {
    run() {
      getZodSchema();
    },
    snippet: ts`z.object(...)`,
  },
  parsing: {
    allErrors: [
      {
        run(data) {
          schema.safeParse(data);
        },
        snippet: ts`schema.safeParse(data)`,
      },
      {
        run(data) {
          schema.safeParse(data, { jitless: true });
        },
        snippet: ts`schema.safeParse(data, { jitless: true })`,
      },
    ],
  },
});
