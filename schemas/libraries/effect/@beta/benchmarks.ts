import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import { isSome } from "effect___beta/Option";
import * as Schema from "effect___beta/Schema";
import * as SchemaGetter from "effect___beta/SchemaGetter";

import { assertNotReached, defineBenchmarks } from "#src";

import { getEffectSchema } from ".";

const schema = getEffectSchema();
const is = Schema.is(schema);
const decode = Schema.decodeUnknownOption(schema);
const DateFromString = Schema.Date.pipe(
  Schema.encodeTo(Schema.String, {
    encode: SchemaGetter.String(),
    decode: SchemaGetter.Date(),
  }),
);

export default defineBenchmarks({
  library: {
    name: "effect@beta",
    git: "effect-ts/effect",
    optimizeType: "none",
    version: await getVersion("effect___beta"),
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
    run(data) {
      return is(data);
    },
    snippet: ts`
      // const is = Schema.is(schema);
      is(data);
    `,
  },
  parsing: {
    allErrors: {
      run(data) {
        return decode(data, { errors: "all" });
      },
      validateResult: isSome,
      snippet: ts`
        // const decode = Schema.decodeUnknownOption(schema);
        decode(data, { errors: "all" })
      `,
    },
    abortEarly: {
      run(data) {
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
      schema: Schema.toStandardSchemaV1(schema, { parseOptions: { errors: "all" } }),
      snippet: ts`
        // const standardSchema = Schema.toStandardSchemaV1(
        //   schema, 
        //   { parseOptions: { errors: "all" } }
        // );
        upfetch(url, { schema: standardSchema });
      `,
    },
    abortEarly: {
      schema: Schema.toStandardSchemaV1(schema, { parseOptions: { errors: "first" } }),
      snippet: ts`
        // const standardSchema = Schema.toStandardSchemaV1(
        //   schema, 
        //   { parseOptions: { errors: "first" } }
        // );
        upfetch(url, { schema: standardSchema });
      `,
    },
  },
  stack: {
    throw: (data) => {
      Schema.decodeUnknownSync(schema)(data, { errors: "first" });
      assertNotReached();
    },
    snippet: ts`
      Schema.decodeUnknownSync(schema)(data, { errors: "first" })
    `,
  },
  codec: {
    encode: {
      run: (data) => {
        return Schema.encodeSync(DateFromString)(data);
      },
      snippet: ts`
        // const DateFromString = Schema.Date.pipe(...);
        Schema.encodeSync(DateFromString)(data)
      `,
    },
    decode: {
      run: (data) => {
        return Schema.decodeSync(DateFromString)(data);
      },
      snippet: ts`
        // const DateFromString = Schema.Date.pipe(...);
        Schema.decodeSync(DateFromString)(data)
      `,
    },
  },
});
