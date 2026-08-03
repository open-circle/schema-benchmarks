import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import { Effect, Either } from "effect";
import * as JSONSchema from "effect/JSONSchema";
import * as Schema from "effect/Schema";

import type {
  JsonSchemaInputData,
  ToJsonSchemaOptions,
  JsonSchemaOutputData,
  JsonSchemaTarget,
} from "#src";
import { assertJsonSchemaTarget, assertNotReached, defineBenchmarks } from "#src";

import { getEffectSchema } from ".";

const schema = getEffectSchema();
const jsonSchemaSubject = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  price: Schema.NumberFromString,
}) satisfies Schema.Schema<JsonSchemaOutputData, JsonSchemaInputData>;

// effect names the targets differently, and only supports these two
const jsonSchemaTargets = {
  "draft-07": "jsonSchema7",
  "draft-2020-12": "jsonSchema2020-12",
} as const;
const supportedJsonSchemaTargets = ["draft-2020-12", "draft-07"] as const;
const getJsonSchemaTarget = (target: JsonSchemaTarget) => {
  assertJsonSchemaTarget(target, supportedJsonSchemaTargets);
  return jsonSchemaTargets[target];
};
const makeJsonSchema = <Output, Input>(
  { target }: ToJsonSchemaOptions,
  subject: Schema.Schema<Output, Input>,
) => JSONSchema.make(subject, { target: getJsonSchemaTarget(target) });
const is = Schema.is(schema);
const decodeAll = Schema.decodeUnknownEither(schema, { errors: "all" });
const decodeFirst = Schema.decodeUnknownEither(schema, { errors: "first" });

export default defineBenchmarks({
  library: {
    name: "effect",
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
  jsonSchema: {
    conversion: {
      toJson: {
        generate: (options) =>
          options.direction === "input"
            ? makeJsonSchema(options, jsonSchemaSubject)
            : makeJsonSchema(options, Schema.typeSchema(jsonSchemaSubject)),
        snippet: ({ target, direction }) =>
          ts`JSONSchema.make(${direction === "input" ? "schema" : "Schema.typeSchema(schema)"}, { target: "${getJsonSchemaTarget(target)}" })`,
        source: { type: "native" },
      },
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
  codec: [
    {
      encode: {
        run: (data) => {
          return Schema.encodeSync(Schema.BigInt)(data);
        },
        snippet: ts`Schema.encodeSync(Schema.BigInt)(data)`,
      },
      decode: {
        run: (data) => {
          return Schema.decodeSync(Schema.BigInt)(data);
        },
        snippet: ts`Schema.decodeSync(Schema.BigInt)(data)`,
      },
    },
    {
      encode: {
        run: (data) => {
          return Schema.encodeUnknownSync(Schema.BigInt)(data);
        },
        snippet: ts`Schema.encodeUnknownSync(Schema.BigInt)(data)`,
      },
      decode: {
        run: (data) => {
          return Schema.decodeUnknownSync(Schema.BigInt)(data);
        },
        snippet: ts`Schema.decodeUnknownSync(Schema.BigInt)(data)`,
      },
      acceptsUnknown: true,
      note: "unknown",
    },
  ],
});
