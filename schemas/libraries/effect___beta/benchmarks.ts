import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent" with { type: "macro" };
import { isSome } from "effect___beta/Option";
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
    const decode = Schema.decodeUnknownOption(schema);
    return { schema, is, decode };
  },
  initialization: [
    {
      run() {
        return getEffectSchema();
      },
      snippet: ts`Schema.struct(...)`,
    },
    {
      run() {
        return Schema.decodeUnknownOption(getEffectSchema());
      },
      note: "decodeUnknownOption",
      snippet: ts`
        Schema.decodeUnknownOption(
          Schema.struct(...)
        )
      `,
    },
  ],
  validation: {
    run(data, { is }) {
      return is(data);
    },
    snippet: ts`
      // const is = Schema.is(schema);
      is(data);
    `,
  },
  parsing: {
    allErrors: {
      run(data, { decode }) {
        return decode(data, { errors: "all" });
      },
      validateResult: isSome,
      snippet: ts`
        // const decode = Schema.decodeUnknownOption(schema);
        decode(data, { errors: "all" })
      `,
    },
    abortEarly: {
      run(data, { decode }) {
        return decode(data, { errors: "first" });
      },
      validateResult: isSome,
      snippet: ts`
        // const decode = Schema.decodeUnknownOption(schema);
        decode(data, { errors: "first" })
      `,
    },
  },
  standard: {
    allErrors: {
      getSchema: ({ schema }) =>
        Schema.toStandardSchemaV1(schema, { parseOptions: { errors: "all" } }),
      snippet: ts`
        // const standardSchema = Schema.toStandardSchemaV1(
        //   schema, 
        //   { parseOptions: { errors: "all" } }
        // );
        upfetch(url, { schema: standardSchema });
      `,
    },
    abortEarly: {
      getSchema: ({ schema }) =>
        Schema.toStandardSchemaV1(schema, { parseOptions: { errors: "first" } }),
      snippet: ts`
        // const standardSchema = Schema.toStandardSchemaV1(
        //   schema, 
        //   { parseOptions: { errors: "first" } }
        // );
        upfetch(url, { schema: standardSchema });
      `,
    },
  },
});
