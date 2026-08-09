import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";

import { assertNotReached, defineBenchmarks } from "#src";

import { getZodCompilerBagSchema } from "./bag.gen";
import { getZodCompilerCompactSchema } from "./compact.gen";
import { getZodCompilerSchema } from "./index.gen";

const schema = getZodCompilerSchema();
const bagSchema = getZodCompilerBagSchema();
const compactSchema = getZodCompilerCompactSchema();

export default defineBenchmarks({
  library: {
    name: "zod-compiler",
    optimizeType: "precompiled",
    version: await getVersion("zod-compiler"),
  },
  initialization: [
    {
      run() {
        return getZodCompilerSchema();
      },
      snippet: ts`compile(schema)`,
    },
    {
      run() {
        return getZodCompilerBagSchema();
      },
      snippet: ts`compile(schema)`,
      note: "bag",
    },
    {
      run() {
        return getZodCompilerCompactSchema();
      },
      snippet: ts`compile(schema)`,
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
          return schema.safeParse(data, { jitless: true });
        },
        validateResult: (result) => result.success,
        snippet: ts`schema.safeParse(data, { jitless: true })`,
        note: "jitless",
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
      { schema: bagSchema as never, note: "bag" },
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
