import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";

import { assertNotReached, defineBenchmarks } from "#src";
import { ok } from "#src";

import { Product as schema } from "./compiled";

export default defineBenchmarks({
  library: {
    name: "@paseri/compiler",
    optimizeType: "precompiled",
    version: await getVersion("@paseri/compiler"),
  },
  parsing: {
    allErrors: [
      {
        run(data) {
          try {
            return ok.true(schema.parse(data));
          } catch {
            return ok.false;
          }
        },
        validateResult: (result) => result.ok,
        getData: (result) => result.value,
        snippet: ts`schema.parse(data)`,
        note: "parse",
        throws: true,
      },
      {
        run(data) {
          return schema.safeParse(data);
        },
        validateResult: (result) => result.ok,
        getData: (result) => result.value,
        snippet: ts`schema.safeParse(data)`,
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
    snippet: ts`schema.parse(data)`,
  },
});
