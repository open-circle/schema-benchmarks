import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";

import type { ProductData } from "#src";
import { assertNotReached, defineBenchmarks } from "#src";

import { getDecoderSchema } from ".";

const schema = getDecoderSchema();

export default defineBenchmarks({
  library: {
    name: "decoders",
    optimizeType: "none",
    version: await getVersion("decoders"),
  },
  initialization: {
    run() {
      return getDecoderSchema();
    },
    snippet: ts`object(...)`,
  },
  parsing: {
    allErrors: {
      // manually annotate return type, as inferred return type is not portable
      run(data): { ok: boolean; value?: ProductData } {
        return schema.decode(data);
      },
      validateResult: (result) => result.ok,
      getData: (result) => result.value,
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
