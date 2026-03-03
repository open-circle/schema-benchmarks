import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";

import { assertNotReached, defineBenchmarks } from "#src";

import { getDecoderSchema } from ".";

const schema = getDecoderSchema();

export default defineBenchmarks({
  library: {
    name: "decoders",
    git: "nvie/decoders",
    optimizeType: "none",
    version: await getVersion("decoders"),
  },
  initialization: {
    run() {
      const schema = getDecoderSchema();
      // @ts-expect-error make the schema non-thenable
      // oxlint-disable-next-line unicorn/no-thenable
      schema.then = undefined;
      return schema;
    },
    snippet: ts`object(...)`,
  },
  parsing: {
    allErrors: {
      // manually annotate return type, as inferred return type is not portable
      run(data): { ok: boolean } {
        return schema.decode(data);
      },
      validateResult: (result) => result.ok,
      snippet: ts`schema.decode(data)`,
    },
  },
  standard: {
    allErrors: { schema },
  },
  stack: {
    throw: (data) => {
      schema.verify(data);
      assertNotReached();
    },
    snippet: ts`schema.verify(data)`,
  },
});
