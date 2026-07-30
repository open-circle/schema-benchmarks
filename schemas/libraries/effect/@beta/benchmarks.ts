import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import { isSome } from "effect___beta/Option";
import * as Schema from "effect___beta/Schema";

import type { JsonSchemaInputData, JsonSchemaOutputData } from "#src";
import {
  assertJsonSchemaDirection,
  assertJsonSchemaTarget,
  assertNotReached,
  defineBenchmarks,
} from "#src";

import { getEffectSchema } from ".";

const schema = getEffectSchema();
const jsonSchemaSubject = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  price: Schema.FiniteFromString,
}) satisfies Schema.Codec<JsonSchemaOutputData, JsonSchemaInputData>;

// the generated document wraps the JSON schema, so it's unwrapped to match the standard interface
const toJsonSchema = () => {
  const { schema: jsonSchema, definitions } = Schema.toJsonSchemaDocument(jsonSchemaSubject);
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    ...jsonSchema,
    ...(definitions && { $defs: definitions }),
  };
};
const is = Schema.is(schema);
const decode = Schema.decodeUnknownOption(schema);

export default defineBenchmarks({
  library: {
    name: "effect@beta",
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
  jsonSchema: {
    // only the input type, and only draft 2020-12
    generate: ({ target, direction }) => {
      assertJsonSchemaTarget(target, ["draft-2020-12"]);
      assertJsonSchemaDirection(direction, ["input"]);
      return toJsonSchema();
    },
    snippet: () => ts`Schema.toJsonSchemaDocument(schema)`,
    source: "runtime",
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
  codec: [
    {
      encode: {
        run: (data) => {
          return Schema.encodeSync(Schema.BigIntFromString)(data);
        },
        snippet: ts`
        Schema.encodeSync(Schema.BigIntFromString)(data)
      `,
      },
      decode: {
        run: (data) => {
          return Schema.decodeSync(Schema.BigIntFromString)(data);
        },
        snippet: ts`
        Schema.decodeSync(Schema.BigIntFromString)(data)
      `,
      },
    },
    {
      encode: {
        run: (data) => {
          return Schema.encodeUnknownSync(Schema.BigIntFromString)(data);
        },
        snippet: ts`
        Schema.encodeUnknownSync(Schema.BigIntFromString)(data)
      `,
      },
      decode: {
        run: (data) => {
          return Schema.decodeUnknownSync(Schema.BigIntFromString)(data);
        },
        snippet: ts`
        Schema.decodeUnknownSync(Schema.BigIntFromString)(data)
      `,
      },
      acceptsUnknown: true,
      note: "unknown",
    },
  ],
});
