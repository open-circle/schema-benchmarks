import type { ComplianceTarget } from "@schema-benchmarks/json-schema-tests/types";
import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import * as z from "zod";

import type { JsonSchemaInputData, JsonSchemaOutputData, StringBenchmarkConfig } from "#src";
import { assertJsonSchemaTarget, assertNotReached, defineBenchmarks } from "#src";

import { getZodSchema } from ".";

const createStringBenchmark = (
  factory: () => z.ZodType<string>,
  snippet: string,
): StringBenchmarkConfig => ({
  create() {
    const schema = factory();
    return (testString) => schema.safeParse(testString).success;
  },
  snippet,
});

const zodTargets: Partial<Record<ComplianceTarget, string>> = {
  "draft2020-12": "draft-2020-12",
  draft7: "draft-07",
  draft4: "draft-04",
};

const schema = getZodSchema();
const compiledSchema = z.compile(schema, { strict: true });
const jsonSchemaSubject = z.object({
  id: z.number(),
  name: z.string(),
  price: z.codec(z.string(), z.number(), { decode: Number, encode: String }),
}) satisfies z.ZodType<JsonSchemaOutputData, JsonSchemaInputData>;
const codec = z.codec(z.string(), z.bigint(), {
  decode: (str) => BigInt(str),
  encode: (value) => value.toString(),
});
const compiledCodec = z.compile(codec, { strict: true });

export default defineBenchmarks({
  library: {
    name: "zod",
    optimizeType: "jit",
    version: await getVersion("zod"),
  },
  initialization: [
    {
      run() {
        return getZodSchema();
      },
      snippet: ts`z.object(...)`,
    },
    {
      run() {
        return z.compile(schema, { strict: true });
      },
      snippet: ts`z.compile(schema, { strict: true })`,
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
        standardJsonSchema: { type: "native", schema: jsonSchemaSubject },
      },
      fromJson: {
        generate: (jsonSchema) => z.fromJSONSchema(jsonSchema),
        snippet: ts`z.fromJSONSchema(jsonSchema)`,
      },
    },
    compliance: {
      semantics: {
        run(schema, data) {
          return z.fromJSONSchema(schema).safeParse(data).success;
        },
        source: { type: "native" },
        snippet: () => ts`z.fromJSONSchema(schema).safeParse(data)`,
      },
      roundtrip: {
        run(schema, { target: complianceTarget }) {
          const target = zodTargets[complianceTarget];
          assertJsonSchemaTarget(target, ["draft-2020-12", "draft-07", "draft-04"]);
          return z.toJSONSchema(z.fromJSONSchema(schema), { target });
        },
        source: { type: "native" },
        snippet: (complianceTarget) =>
          ts`z.toJSONSchema(z.fromJSONSchema(schema), { target: "${zodTargets[complianceTarget] ?? complianceTarget}" })`,
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
          return codec.encode(data);
        },
        snippet: ts`z.codec(...).encode(data)`,
      },
      decode: {
        run: (data) => {
          return codec.decode(data);
        },
        snippet: ts`z.codec(...).decode(data)`,
      },
    },
    {
      encode: {
        run: (data) => {
          return compiledCodec.encode(data);
        },
        snippet: ts`
          // const compiledCodec = z.compile(codec, { strict: true })
          compiledCodec.encode(data)
        `,
      },
      decode: {
        run: (data) => {
          return compiledCodec.decode(data);
        },
        snippet: ts`
          // const compiledCodec = z.compile(codec, { strict: true })
          compiledCodec.decode(data)
        `,
      },
      note: "compile",
    },
  ],
});
