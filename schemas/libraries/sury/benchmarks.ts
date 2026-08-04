import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import * as S from "sury";

import type { JsonSchemaInputData, JsonSchemaOutputData, StringBenchmarkConfig } from "#src";
import { assertNotReached, assertJsonSchemaTarget, defineBenchmarks } from "#src";

import { getSurySchema } from ".";

const createStringBenchmark = (
  schema: S.Schema<string>,
  snippet: string,
): StringBenchmarkConfig => ({
  create() {
    return (testString) => S.is(schema, testString);
  },
  snippet,
});

const schema = getSurySchema();

// `~standard.jsonSchema` throws until this is called
S.enableStandardJSONSchema();
const jsonSchemaSubject = S.schema({
  id: S.number,
  name: S.string,
  price: S.to(S.string, S.number, Number, String),
}) satisfies S.Schema<JsonSchemaInputData, JsonSchemaOutputData>;
const parser = S.parser(getSurySchema());
const encoder = S.encoder(S.bigint, S.string);
const decoder = S.decoder(S.string, S.bigint);

const success = {
  true: { success: true },
  false: { success: false },
};

export default defineBenchmarks({
  library: {
    name: "sury",
    optimizeType: "jit",
    version: await getVersion("sury"),
  },
  initialization: [
    {
      run() {
        return getSurySchema();
      },
      snippet: ts`S.schema(...)`,
    },
    {
      run() {
        return S.parser(getSurySchema());
      },
      snippet: ts`S.parser(S.schema(...))`,
      note: "parser",
    },
  ],
  validation: {
    run(data) {
      return S.is(schema, data);
    },
    snippet: ts`S.is(S.schema(...), data)`,
  },
  parsing: {
    allErrors: [
      {
        run(data) {
          try {
            parser(data);
            return success.true;
          } catch {
            return success.false;
          }
        },
        validateResult: (result) => result.success,
        snippet: ts`
        // const parser = S.parser(S.schema(...));
        parser(data);
      `,
        throws: true,
      },
      {
        run(data) {
          return S.safe(() => parser(data));
        },
        validateResult: (result) => result.success,
        snippet: ts`S.safe(() => parser(data))`,
        note: "safe",
      },
    ],
  },
  standard: {
    allErrors: { schema },
  },
  jsonSchema: {
    conversion: {
      toJson: {
        generate: ({ target, direction }) =>
          direction === "input"
            ? S.toJSONSchema(jsonSchemaSubject, { target })
            : S.toJSONSchema(S.reverse(jsonSchemaSubject), { target }),
        snippet: ({ target, direction }) =>
          ts`S.toJSONSchema(${direction === "input" ? "schema" : "S.reverse(schema)"}, { target: "${target}" })`,
        source: { type: "native" },
        // `~standard.jsonSchema` works after S.enableStandardJSONSchema()
        standardJsonSchema: { type: "opt-in", schema: jsonSchemaSubject },
      },
      fromJson: {
        generate: (jsonSchema) => S.fromJSONSchema(jsonSchema),
        snippet: ts`S.fromJSONSchema(jsonSchema)`,
      },
    },
    compliance: {
      semantics: {
        run(schema, data) {
          if (typeof schema === "boolean") throw new Error("sury does not support boolean schemas");
          return S.is(S.fromJSONSchema(schema), data);
        },
        snippet: () => ts`S.is(S.fromJSONSchema(schema), data)`,
        source: { type: "native" },
      },
      roundtrip: {
        run(schema, target) {
          assertJsonSchemaTarget(target, ["draft-2020-12", "draft-07"]);
          if (typeof schema === "boolean") throw new Error("sury does not support boolean schemas");
          return S.toJSONSchema(S.fromJSONSchema(schema), { target });
        },
        snippet: (target) => ts`S.toJSONSchema(S.fromJSONSchema(schema), { target: "${target}" })`,
        source: { type: "native" },
      },
    },
  },
  string: {
    "date-time": createStringBenchmark(S.isoDateTime, ts`S.isoDateTime`),
    date: createStringBenchmark(S.isoDate, ts`S.isoDate`),
    time: createStringBenchmark(S.isoTime, ts`S.isoTime`),
    duration: createStringBenchmark(S.duration, ts`S.duration`),
    email: createStringBenchmark(S.email, ts`S.email`),
    url: createStringBenchmark(S.uri, ts`S.uri`),
    uuid: createStringBenchmark(S.uuid, ts`S.uuid`),
    ipv4: createStringBenchmark(S.ipv4, ts`S.ipv4`),
    ipv6: createStringBenchmark(S.ipv6, ts`S.ipv6`),
  },
  stack: {
    throw: (data) => {
      parser(data);
      assertNotReached();
    },
    snippet: ts`
    // const parser = S.parser(S.schema(...));
    parser(data)
    `,
  },
  codec: {
    encode: {
      run(data) {
        return encoder(data);
      },
      snippet: ts`
      // const encoder = S.encoder(S.bigint, S.string);
      encoder(data)
      `,
    },
    decode: {
      run(data) {
        return decoder(data);
      },
      snippet: ts`
      // const decoder = S.decoder(S.string, S.bigint);
      decoder(data)
      `,
    },
  },
});
