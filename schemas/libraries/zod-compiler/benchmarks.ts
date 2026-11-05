import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";

import type { ProductData } from "#src";
import { assertNotReached, defineBenchmarks } from "#src";

import { compiledProductSchema as bagSchema } from "./compiled/bag/index.mjs";
import { compiledProductSchema as bagMiniSchema } from "./compiled/bag/mini.mjs";
import { compiledProductSchema as compactSchema } from "./compiled/compact/index.mjs";
import { compiledProductSchema as compactMiniSchema } from "./compiled/compact/mini.mjs";
import { compiledProductSchema as schema } from "./compiled/index.mjs";
import { compiledProductSchema as miniSchema } from "./compiled/mini.mjs";

export default defineBenchmarks<{ data?: ProductData; success: boolean }>({
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
    {
      run(data) {
        return miniSchema.is(data);
      },
      snippet: ts`miniSchema.is(data)`,
      note: "mini",
    },
    {
      run(data) {
        return bagMiniSchema.is(data);
      },
      snippet: ts`bagMiniSchema.is(data)`,
      note: "bag + mini",
    },
    {
      run(data) {
        return compactMiniSchema.is(data);
      },
      snippet: ts`compactMiniSchema.is(data)`,
      note: "compact + mini",
    },
  ],
  parsing: {
    allErrors: [
      {
        run(data) {
          return schema.safeParse(data);
        },
        validateResult: (result) => result.success,
        getData: (result) => result.data,
        snippet: ts`schema.safeParse(data)`,
      },
      {
        run(data) {
          return bagSchema.safeParse(data);
        },
        validateResult: (result) => result.success,
        getData: (result) => result.data,
        snippet: ts`bagSchema.safeParse(data)`,
        note: "bag",
      },
      {
        run(data) {
          return compactSchema.safeParse(data);
        },
        validateResult: (result) => result.success,
        getData: (result) => result.data,
        snippet: ts`compactSchema.safeParse(data)`,
        note: "compact",
      },
      {
        run(data) {
          return miniSchema.safeParse(data);
        },
        validateResult: (result) => result.success,
        getData: (result) => result.data,
        snippet: ts`miniSchema.safeParse(data)`,
        note: "mini",
      },
      {
        run(data) {
          return bagMiniSchema.safeParse(data);
        },
        validateResult: (result) => result.success,
        getData: (result) => result.data,
        snippet: ts`bagMiniSchema.safeParse(data)`,
        note: "bag + mini",
      },
      {
        run(data) {
          return compactMiniSchema.safeParse(data);
        },
        validateResult: (result) => result.success,
        getData: (result) => result.data,
        snippet: ts`compactMiniSchema.safeParse(data)`,
        note: "compact + mini",
      },
    ],
  },
  standard: {
    allErrors: [
      { schema },
      { schema: bagSchema, note: "bag" },
      { schema: compactSchema, note: "compact" },
      { schema: miniSchema, note: "mini" },
      { schema: bagMiniSchema, note: "bag + mini" },
      { schema: compactMiniSchema, note: "compact + mini" },
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
