import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import * as z from "zod";

import { defineBenchmarks } from "#src";

import { getZodSchema } from ".";

export default defineBenchmarks({
  library: {
    name: "zod",
    git: "colinhacks/zod",
    optimizeType: "jit",
    version: await getVersion("zod"),
  },
  createContext: () => ({
    schema: getZodSchema(),
  }),
  initialization: {
    run() {
      return getZodSchema();
    },
    snippet: ts`z.object(...)`,
  },
  parsing: {
    allErrors: [
      {
        run(data, { schema }) {
          return schema.safeParse(data);
        },
        validateResult: (result) => result.success,
        snippet: ts`schema.safeParse(data)`,
      },
      {
        run(data, { schema }) {
          return schema.safeParse(data, { jitless: true });
        },
        validateResult: (result) => result.success,
        snippet: ts`schema.safeParse(data, { jitless: true })`,
        note: "jitless",
        optimizeType: "none",
      },
    ],
  },
  standard: {
    allErrors: {
      getSchema: ({ schema }) => schema,
    },
  },
  string: {
    email: {
      create() {
        const schema = z.email();
        return (testString) => schema.safeParse(testString).success;
      },
      snippet: ts`z.email()`,
    },
    url: {
      create() {
        const schema = z.url();
        return (testString) => schema.safeParse(testString).success;
      },
      snippet: ts`z.url()`,
    },
    uuid: {
      create() {
        const schema = z.uuid();
        return (testString) => schema.safeParse(testString).success;
      },
      snippet: ts`z.uuid()`,
    },
  },
});
