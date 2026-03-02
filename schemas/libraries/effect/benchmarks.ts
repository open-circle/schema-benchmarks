import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import { Effect, Either } from "effect";
import * as Schema from "effect/Schema";

import { assertNotReached, defineBenchmarks } from "#src";

import { getEffectSchema } from ".";

const schema = getEffectSchema();
const is = Schema.is(schema);
const decodeAll = Schema.decodeUnknownEither(schema, { errors: "all" });
const decodeFirst = Schema.decodeUnknownEither(schema, { errors: "first" });

export default defineBenchmarks({
  library: {
    name: "effect",
    git: "effect-ts/effect",
    optimizeType: "none",
    version: await getVersion("effect"),
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
        return Schema.decodeUnknownEither(getEffectSchema());
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
        return decodeAll(data);
      },
      validateResult: Either.isRight,
      snippet: ts`
        // const decodeAll = Schema.decodeUnknownEither(
        //  schema, 
        //  { errors: "all" }
        // );
        decodeAll(data)
      `,
    },
    abortEarly: {
      run(data) {
        return decodeFirst(data);
      },
      validateResult: Either.isRight,
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
      schema: Schema.standardSchemaV1(schema, { errors: "all" }),
      snippet: ts`
        // const standardSchema = Schema.standardSchemaV1(
        //   schema, 
        //   { errors: "all" }
        // );
        upfetch(url, { schema: standardSchema });
      `,
    },
    abortEarly: {
      schema: Schema.standardSchemaV1(schema, { errors: "first" }),
      snippet: ts`
        // const standardSchema = Schema.standardSchemaV1(
        //   schema, 
        //   { errors: "first" }
        // );
        upfetch(url, { schema: standardSchema });
      `,
    },
  },
  stack: {
    throw: (data) => {
      Effect.runSync(decodeAll(data));
      assertNotReached();
    },
    snippet: ts`
      // const decodeAll = Schema.decodeUnknownEither(
      //  schema, 
      //  { errors: "all" }
      // );
      Effect.runSync(decodeAll(data));
    `,
  },
  codec: {
    encode: {
      run: (data) => {
        return Schema.encodeSync(Schema.Date)(data);
      },
      snippet: ts`Schema.encodeSync(Schema.Date)(data)`,
    },
    decode: {
      run: (data) => {
        return Schema.decodeSync(Schema.Date)(data);
      },
      snippet: ts`Schema.decodeSync(Schema.Date)(data)`,
    },
  },
});
