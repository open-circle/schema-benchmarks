import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";

import { assertNotReached, defineBenchmarks } from "#src";

import { Product } from "./compiled.gen.ts";

export default defineBenchmarks({
  library: {
    name: "@paseri/compiler",
    optimizeType: "precompiled",
    version: await getVersion("@paseri/compiler"),
  },
  initialization: {
    run() {
      return Product;
    },
    note: "import",
    snippet: ts`
      // const source = toSource(schema.toIR(), { name: "Product" });
      import { Product } from "./product.gen.ts";
    `,
  },
  validation: {
    run(data) {
      return Product.safeParse(data).ok;
    },
    snippet: ts`Product.safeParse(data).ok`,
  },
  parsing: {
    allErrors: [
      {
        run(data) {
          try {
            Product.parse(data);
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
        run(data) {
          return { ok: Product.safeParse(data).ok };
        },
        validateResult: (result) => result.ok,
        snippet: ts`Product.safeParse(data)`,
        note: "safeParse",
      },
    ],
  },
  standard: {
    allErrors: { schema: Product },
  },
  stack: {
    throw: (data) => {
      Product.parse(data);
      assertNotReached();
    },
    snippet: ts`Product.parse(data)`,
  },
});
