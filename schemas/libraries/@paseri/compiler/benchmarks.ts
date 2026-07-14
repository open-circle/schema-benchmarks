import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";

import { assertNotReached, defineBenchmarks } from "#src";

import { getPaseriSchema } from "./index.gen";

const schema = getPaseriSchema();

export default defineBenchmarks({
  library: {
    name: "@paseri/compiler",
    optimizeType: "precompiled",
    version: await getVersion("@paseri/compiler"),
  },
  initialization: {
    run() {
      return getPaseriSchema();
    },
    snippet: ts`
      // const source = toSource(schema.toIR(), { name: "Product" });
      import { Product } from "./product.gen.ts";
    `,
  },
  parsing: {
    allErrors: [
      {
        run(data) {
          try {
            schema.parse(data);
            return { ok: true };
          } catch {
            return { ok: false };
          }
        },
        validateResult: (result) => result.ok,
        snippet: ts`Product.parse(data)`,
        note: "parse",
        throws: true,
      },
      {
        run(data): { ok: boolean } {
          return schema.safeParse(data);
        },
        validateResult: (result) => result.ok,
        snippet: ts`Product.safeParse(data)`,
        note: "safeParse",
      },
    ],
  },
  standard: {
    allErrors: { schema: schema },
  },
  stack: {
    throw: (data) => {
      schema.parse(data);
      assertNotReached();
    },
    snippet: ts`Product.parse(data)`,
  },
});
