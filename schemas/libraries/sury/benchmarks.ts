import type { ComplianceTarget } from "@schema-benchmarks/json-schema-tests/types";
import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import * as S from "sury";

import type { JsonSchemaOutputData, StringBenchmarkConfig } from "#src";
import { assertNotReached, assertJsonSchemaTarget, defineBenchmarks, success } from "#src";

import { getSurySchema } from ".";

const createStringBenchmark = (
  schema: S.Schema<string>,
  snippet: string,
): StringBenchmarkConfig => ({
  create() {
    return S.isInput(schema);
  },
  snippet,
});

const schema = getSurySchema();

const suryTargets: Partial<Record<ComplianceTarget, string>> = {
  "draft2020-12": "draft-2020-12",
  draft7: "draft-07",
};

// `~standard.jsonSchema` throws until this is called
S.enableStandardJSONSchema();
const jsonSchemaSubject = S.schemaOf<JsonSchemaOutputData>()({
  id: S.number,
  name: S.string,
  price: S.string.with(S.to, S.number),
});
const isValid = S.isInput(schema);
const parse = S.parseOrThrow(getSurySchema());
const parseAsResult = S.parseAsResult(getSurySchema());
const encode = S.encodeOrThrow(S.bigint, S.string);
const decode = S.decodeOrThrow(S.string, S.bigint);

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
      snippet: ts`S.schema(value)`,
    },
    {
      run() {
        return S.parseOrThrow(getSurySchema());
      },
      snippet: ts`S.parseOrThrow(S.schema(value))`,
      note: "compiled",
    },
  ],
  validation: [
    {
      run(data) {
        return S.isInput(schema, data);
      },
      snippet: ts`S.isInput(S.schema(value), data)`,
    },
    {
      run(data) {
        return isValid(data);
      },
      snippet: ts`
        // setup-start
        const isValid = S.isInput(S.schema(value));
        // setup-end
        isValid(data);
      `,
      note: "compiled",
    },
  ],
  parsing: {
    allErrors: [
      {
        run(data) {
          try {
            return success.true(parse(data));
          } catch {
            return success.false;
          }
        },
        validateResult: (result) => result.success,
        getData: (result) => result.value,
        snippet: ts`
        // setup-start
        const parse = S.parseOrThrow(S.schema(value));
        // setup-end
        parse(data);
      `,
        throws: true,
      },
      {
        run(data) {
          return parseAsResult(data);
        },
        validateResult: (result) => result.success,
        getData: (result) => result.value,
        snippet: ts`
        // setup-start
        const parseAsResult = S.parseAsResult(S.schema(value));
        // setup-end
        parseAsResult(data);
      `,
        note: "asResult",
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
            ? S.toInputJSONSchemaOrThrow(jsonSchemaSubject, { target })
            : S.toOutputJSONSchemaOrThrow(jsonSchemaSubject, { target }),
        snippet: ({ target, direction }) =>
          ts`S.to${direction === "input" ? "Input" : "Output"}JSONSchemaOrThrow(schema, { target: "${target}" })`,
        source: { type: "native" },
        // `~standard.jsonSchema` works after S.enableStandardJSONSchema()
        standardJsonSchema: { type: "opt-in", schema: jsonSchemaSubject },
      },
      fromJson: {
        generate: (jsonSchema) => S.fromJSONSchemaOrThrow(jsonSchema),
        snippet: ts`S.fromJSONSchemaOrThrow(jsonSchema)`,
      },
    },
    compliance: {
      semantics: {
        run(schema, data) {
          if (typeof schema === "boolean") throw new Error("sury does not support boolean schemas");
          return S.isInput(S.fromJSONSchemaOrThrow(schema), data);
        },
        snippet: () => ts`S.isInput(S.fromJSONSchemaOrThrow(schema), data)`,
        source: { type: "native" },
      },
      roundtrip: {
        run(schema, { target: complianceTarget }) {
          const target = suryTargets[complianceTarget];
          assertJsonSchemaTarget(target, ["draft-2020-12", "draft-07"]);
          if (typeof schema === "boolean") throw new Error("sury does not support boolean schemas");
          return S.toInputJSONSchemaOrThrow(S.fromJSONSchemaOrThrow(schema), { target });
        },
        snippet: (complianceTarget) =>
          ts`S.toInputJSONSchemaOrThrow(S.fromJSONSchemaOrThrow(schema), { target: "${suryTargets[complianceTarget] ?? complianceTarget}" })`,
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
      parse(data);
      assertNotReached();
    },
    snippet: ts`
    // setup-start
    const parse = S.parseOrThrow(S.schema(value));
    // setup-end
    parse(data)
    `,
  },
  codec: {
    encode: {
      run(data) {
        return encode(data);
      },
      snippet: ts`
      // setup-start
      const encode = S.encodeOrThrow(S.bigint, S.string);
      // setup-end
      encoder(data)
      `,
    },
    decode: {
      run(data) {
        return decode(data);
      },
      snippet: ts`
      // setup-start
      const decode = S.decodeOrThrow(S.string, S.bigint);
      // setup-end
      decoder(data)
      `,
    },
  },
  types: {
    imports: ts`
      import * as S from "sury";
      import { getSurySchema } from ".";
    `,
    schema: "getSurySchema()",
    input: "S.Input<typeof probeSchema>",
    output: "S.Output<typeof probeSchema>",
    fromType: {
      style: "builder",
      schema: ts`
        const probeSchema = S.schemaOf<Product>()({ id: S.number, name: S.string, price: S.number });
      `,
    },
  },
});
