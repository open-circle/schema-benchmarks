import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";

import { assertNotReached, defineBenchmarks } from "#src";

import { compiledProductSchema as bagSchema } from "./compiled/bag/index.mjs";
import { compiledProductSchema as compactSchema } from "./compiled/compact/index.mjs";
import { compiledProductSchema as schema } from "./compiled/index.mjs";

export default defineBenchmarks({
  library: {
    name: "zod-compiler",
    optimizeType: "precompiled",
    version: await getVersion("zod-compiler"),
  },
  validation: [
    {
      run(data) {
        return schema.is(data);
      },
      snippet: ts`schema.is(data)`,
    },
    {
      run(data) {
        return bagSchema.is(data);
      },
      snippet: ts`bagSchema.is(data)`,
      note: "bag",
    },
    {
      run(data) {
        return compactSchema.is(data);
      },
      snippet: ts`compactSchema.is(data)`,
      note: "compact",
    },
  ],
  parsing: {
    allErrors: [
      {
        run(data): { success: boolean } {
          return schema.safeParse(data);
        },
        validateResult: (result) => result.success,
        snippet: ts`schema.safeParse(data)`,
      },
      {
        run(data) {
          return bagSchema.safeParse(data);
        },
        validateResult: (result) => result.success,
        snippet: ts`bagSchema.safeParse(data)`,
        note: "bag",
      },
      {
        run(data) {
          return compactSchema.safeParse(data);
        },
        validateResult: (result) => result.success,
        snippet: ts`compactSchema.safeParse(data)`,
        note: "compact",
      },
    ],
  },
  standard: {
    allErrors: [
      { schema },
      { schema: bagSchema, note: "bag" },
      { schema: compactSchema, note: "compact" },
    ],
  },
  stack: {
    throw: (data) => {
      schema.parse(data);
      assertNotReached();
    },
    snippet: ts`schema.parse(data)`,
  },
});
