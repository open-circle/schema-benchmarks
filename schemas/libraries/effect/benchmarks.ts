import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent" with { type: "macro" };
import * as Schema from "effect/Schema";

import { defineBenchmarks } from "#src";

import { getEffectSchema } from ".";

export default defineBenchmarks({
  library: {
    name: "effect",
    git: "effect-ts/effect",
    optimizeType: "none",
    version: await getVersion("effect"),
  },
  createContext: () => {
    const schema = getEffectSchema();
    const is = Schema.is(schema);
    const decodeAll = Schema.decodeUnknownEither(schema, { errors: "all" });
    const decodeFirst = Schema.decodeUnknownEither(schema, { errors: "first" });
    return { schema, is, decodeAll, decodeFirst };
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
        Schema.decodeUnknownEither(getEffectSchema());
      },
      note: "decodeUnknownEither",
      snippet: ts`
        Schema.decodeUnknownEither(
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
      run(data, { decodeAll }) {
        decodeAll(data);
      },
      snippet: ts`
        // const decodeAll = Schema.decodeUnknownEither(
        //  schema, 
        //  { errors: "all" }
        // );
        decodeAll(data)
      `,
    },
    abortEarly: {
      run(data, { decodeFirst }) {
        decodeFirst(data);
      },
      snippet: ts`
        // const decodeFirst = Schema.decodeUnknownEither(
        //  schema, 
        //  { errors: "first" }
        // );
        decodeFirst(data)
      `,
    },
  },
  standard: {
    allErrors: {
      getSchema: ({ schema }) => Schema.standardSchemaV1(schema, { errors: "all" }),
      snippet: ts`
        // const standardSchema = Schema.standardSchemaV1(
        //   schema, 
        //   { errors: "all" }
        // );
        upfetch(url, { schema: standardSchema });
      `,
    },
    abortEarly: {
      getSchema: ({ schema }) => Schema.standardSchemaV1(schema, { errors: "first" }),
      snippet: ts`
        // const standardSchema = Schema.standardSchemaV1(
        //   schema, 
        //   { errors: "first" }
        // );
        upfetch(url, { schema: standardSchema });
      `,
    },
  },
});
