import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import * as z from "zod/mini";

import type { JsonSchemaInputData, JsonSchemaOutputData, StringBenchmarkConfig } from "#src";
import { assertNotReached, defineBenchmarks } from "#src";

import { getZodMiniSchema } from ".";

const createStringBenchmark = (
  factory: () => z.ZodMiniType<string>,
  snippet: string,
): StringBenchmarkConfig => ({
  create() {
    const schema = factory();
    return (testString) => schema.safeParse(testString).success;
  },
  snippet,
});

const schema = getZodMiniSchema();
const compiledSchema = z.compile(schema, { strict: true });
const jsonSchemaSubject = z.object({
  id: z.number(),
  name: z.string(),
  price: z.codec(z.string(), z.number(), { decode: Number, encode: String }),
}) satisfies z.ZodMiniType<JsonSchemaOutputData, JsonSchemaInputData>;
const codec = z.codec(z.string(), z.bigint(), {
  encode: (value) => value.toString(),
  decode: (str) => BigInt(str),
});
const compiledCodec = z.compile(codec, { strict: true });

export default defineBenchmarks({
  library: {
    name: "zod/mini",
    optimizeType: "jit",
    version: await getVersion("zod"),
  },
  initialization: [
    {
      run() {
        return getZodMiniSchema();
      },
      snippet: ts`z.object(...)`,
    },
    {
      run() {
        return z.compile(getZodMiniSchema(), { strict: true });
      },
      snippet: ts`z.compile(z.object(...), { strict: true })`,
      note: "compile",
    },
  ],
  validation: [
    {
      run(data) {
        return z.validate(schema, data);
      },
      snippet: ts`z.validate(schema, data)`,
    },
    {
      run(data) {
        return z.validate(compiledSchema, data);
      },
      snippet: ts`z.validate(compiledSchema, data)`,
      note: "compile",
    },
  ],
  parsing: {
    allErrors: [
      {
        run(data) {
          return schema.safeParse(data);
        },
        validateResult: (result) => result.success,
        getData: (result) => result.data,
        snippet: ts`schema.safeParse(data)`,
      },
      {
        run(data) {
          return schema.safeParse(data, { jitless: true });
        },
        validateResult: (result) => result.success,
        getData: (result) => result.data,
        snippet: ts`schema.safeParse(data, { jitless: true })`,
        note: "jitless",
        optimizeType: "none",
      },
      {
        run(data) {
          return compiledSchema.safeParse(data);
        },
        validateResult: (result) => result.success,
        getData: (result) => result.data,
        snippet: ts`compiledSchema.safeParse(data)`,
        note: "compile",
      },
    ],
  },
  standard: {
    allErrors: [
      { schema },
      {
        schema: compiledSchema,
        snippet: ts`
          // const compiledSchema = z.compile(schema, { strict: true })
          upfetch(url, { schema: compiledSchema })
        `,
        note: "compile",
      },
    ],
  },
  jsonSchema: {
    conversion: {
      toJson: {
        generate: ({ target, direction }) =>
          z.toJSONSchema(jsonSchemaSubject, { target, io: direction }),
        snippet: ({ target, direction }) =>
          ts`z.toJSONSchema(schema, { target: "${target}", io: "${direction}" })`,
        source: { type: "native" },
        // unlike zod's, zod/mini schemas don't carry `~standard.jsonSchema`
      },
    },
  },
  string: {
    "date-time": createStringBenchmark(z.iso.datetime, ts`z.iso.datetime()`),
    date: createStringBenchmark(z.iso.date, ts`z.iso.date()`),
    // doesn't allow offset
    // time: createStringBenchmark(z.iso.time, ts`z.iso.time()`),
    duration: createStringBenchmark(z.iso.duration, ts`z.iso.duration()`),
    email: createStringBenchmark(z.email, ts`z.email()`),
    url: createStringBenchmark(z.url, ts`z.url()`),
    uuid: createStringBenchmark(z.uuid, ts`z.uuid()`),
    ipv4: createStringBenchmark(z.ipv4, ts`z.ipv4()`),
    ipv6: createStringBenchmark(z.ipv6, ts`z.ipv6()`),
  },
  stack: {
    throw: (data) => {
      schema.parse(data);
      assertNotReached();
    },
    snippet: ts`schema.parse(data)`,
  },
  codec: [
    {
      encode: {
        run: (data) => {
          return z.encode(codec, data);
        },
        snippet: ts`z.encode(codec, data)`,
      },
      decode: {
        run: (data) => {
          return z.decode(codec, data);
        },
        snippet: ts`z.decode(codec, data)`,
      },
    },
    {
      encode: {
        run: (data) => {
          return z.encode(compiledCodec, data);
        },
        snippet: ts`z.encode(compiledCodec, data)`,
      },
      decode: {
        run: (data) => {
          return z.decode(compiledCodec, data);
        },
        snippet: ts`z.decode(compiledCodec, data)`,
      },
      note: "compile",
    },
  ],
});
