import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";

import { assertNotReached, defineBenchmarks } from "#src";

import { Product as schema } from "./compiled";

const ok = {
  true: { ok: true },
  false: { ok: false },
};

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
            schema.parse(data);
            return ok.true;
          } catch {
            return ok.false;
          }
        },
        validateResult: (result) => result.ok,
        snippet: ts`schema.parse(data)`,
        note: "parse",
        throws: true,
      },
      {
        run(data): { ok: boolean } {
          return schema.safeParse(data);
        },
        validateResult: (result) => result.ok,
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
