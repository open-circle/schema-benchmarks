import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent" with { type: "macro" };
import * as Schema from "effect___beta/Schema";

import { defineBenchmarks } from "#src";

import { getEffectSchema } from ".";

export default defineBenchmarks({
  library: {
    name: "effect___beta",
    git: "effect-ts/effect",
    optimizeType: "none",
    version: await getVersion("effect___beta"),
  },
  createContext: () => {
    const schema = getEffectSchema();
    const is = Schema.is(schema);
    const decode = Schema.decodeUnknownSync(schema);
    return { schema, is, decode };
  },
  initialization: [
    {
      run() {
        getEffectSchema();
      },
      snippet: ts`Schema.struct(...)`,
    },
    {
      run() {
        Schema.decodeUnknownSync(getEffectSchema());
      },
      note: "decodeUnknownSync",
      snippet: ts`
        Schema.decodeUnknownSync(
          Schema.struct(...)
        )
      `,
    },
  ],
  validation: {
    run(data, { is }) {
      is(data);
    },
    snippet: ts`
      // const is = Schema.is(schema);
      is(data);
    `,
  },
  parsing: {
    allErrors: {
      run(data, { decode }) {
        decode(data, { errors: "all" });
      },
      snippet: ts`
        // const decode = Schema.decodeUnknownSync(schema);
        decode(data, { errors: "all" })
      `,
    },
    abortEarly: {
      run(data, { decode }) {
        decode(data, { errors: "first" });
      },
      snippet: ts`
        // const decode = Schema.decodeUnknownSync(schema);
        decode(data, { errors: "first" })
      `,
    },
  },
});
