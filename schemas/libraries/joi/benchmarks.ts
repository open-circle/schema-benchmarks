import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import Joi from "joi";
import parse from "joi-to-json";

import type { JsonSchemaTarget, StringBenchmarkConfig } from "#src";
import { assertJsonSchemaDirection, assertJsonSchemaTarget, defineBenchmarks } from "#src";

import { getJoiSchema } from ".";

type FormatMethod = {
  [M in keyof Joi.StringSchema]-?: Joi.StringSchema[M] extends () => Joi.StringSchema ? M : never;
}[keyof Joi.StringSchema];

const createStringBenchmark = <Format extends FormatMethod>(
  method: Format,
  snippet = `${method}()`,
  ...args: Parameters<Joi.StringSchema[Format]>
): StringBenchmarkConfig => ({
  create() {
    const schema = Joi.string()[method](...(args as []));
    return (testString) => !schema.validate(testString).error;
  },
  snippet: ts`Joi.string().${snippet}`,
});

const schema = getJoiSchema();

// joi's keys are optional unless required, and every other library's are required
const jsonSchemaSubject = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  price: Joi.string().required(),
});

// joi-to-json names the targets differently, and has no draft 2020-12
const jsonSchemaModes = {
  "draft-07": "json",
  "openapi-3.0": "open-api",
} as const satisfies Partial<Record<JsonSchemaTarget, string>>;
const getJsonSchemaMode = (target: JsonSchemaTarget) => {
  assertJsonSchemaTarget(target, ["draft-07", "openapi-3.0"]);
  return jsonSchemaModes[target];
};

export default defineBenchmarks({
  library: {
    name: "joi",
    optimizeType: "none",
    version: await getVersion("joi"),
  },
  initialization: {
    run() {
      return getJoiSchema();
    },
    snippet: ts`object(...)`,
  },
  parsing: {
    allErrors: {
      run(data) {
        return schema.validate(data, { abortEarly: false });
      },
      validateResult: (result) => !result.error,
      snippet: ts`schema.validate(data, { abortEarly: false })`,
    },
    abortEarly: {
      run(data) {
        return schema.validate(data, { abortEarly: true });
      },
      validateResult: (result) => !result.error,
      snippet: ts`schema.validate(data, { abortEarly: true })`,
    },
  },
  standard: {
    allErrors: { schema },
  },
  jsonSchema: {
    conversion: {
      toJson: {
        generate: ({ target, direction }) => {
          assertJsonSchemaDirection(direction, ["input"]);
          return parse(jsonSchemaSubject, getJsonSchemaMode(target)) as object;
        },
        snippet: ({ target }) => ts`parse(schema, "${getJsonSchemaMode(target)}")`,
        source: "runtime",
      },
    },
  },
  string: {
    "date-time": createStringBenchmark("isoDate"),
    duration: createStringBenchmark("isoDuration"),
    email: createStringBenchmark("email"),
    url: createStringBenchmark("uri"),
    uuid: createStringBenchmark("uuid"),
    ipv4: createStringBenchmark("ip", ts`ip({ version: "ipv4" })`, { version: "ipv4" }),
    ipv6: createStringBenchmark("ip", ts`ip({ version: "ipv6" })`, { version: "ipv6" }),
  },
  stack: {
    throw: (data) => {
      throw schema.validate(data).error;
    },
    snippet: ts`throw schema.validate(data).error`,
  },
});
