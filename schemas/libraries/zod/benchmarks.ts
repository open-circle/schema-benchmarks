import { defineBenchmarks } from "@schema-benchmarks/schemas";
import { getVersion } from "@schema-benchmarks/utils" with { type: "macro" };
import ts from "dedent" with { type: "macro" };
import { getZodSchema } from ".";
import { getZodMiniSchema } from "./mini";

const schema = getZodSchema();
const miniSchema = getZodMiniSchema();

export default defineBenchmarks({
  library: {
    name: "zod",
    type: "runtime",
    version: await getVersion("zod"),
  },
  initialization: [
    {
      run() {
        getZodSchema();
      },
      snippet: ts`z.object(...)`,
    },
    {
      run() {
        getZodMiniSchema();
      },
      snippet: ts`z.object(...)`,
      note: "mini",
    },
  ],
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
        note: "jitless",
      },
      {
        run(data) {
          miniSchema.safeParse(data);
        },
        snippet: ts`schema.safeParse(data)`,
        note: "mini",
      },
      {
        run(data) {
          miniSchema.safeParse(data, { jitless: true });
        },
        snippet: ts`schema.safeParse(data, { jitless: true })`,
        note: "mini, jitless",
      },
    ],
  },
});
