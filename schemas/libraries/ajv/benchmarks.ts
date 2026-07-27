import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import type { JSONSchemaType } from "ajv";
import { ValidationError } from "ajv";
import type { FormatName } from "ajv-formats";
import addFormats from "ajv-formats";
import ts from "dedent";

import type { JsonSchemaInputData, StringBenchmarkConfig } from "#src";
import { assertJsonSchemaTarget, defineBenchmarks } from "#src";

import { getAjv, getAjvSchema } from ".";

const ajv = getAjv();

const schema = getAjvSchema();
const validate = ajv.compile(schema);

const createStringBenchmark = (format: FormatName): StringBenchmarkConfig => ({
  create() {
    addFormats(ajv, { formats: [format] });
    return ajv.compile({ type: "string", format } satisfies JSONSchemaType<string>);
  },
  snippet: ts`{ type: "string", format: "${format}" }`,
});

const jsonSchemaSubject: JSONSchemaType<JsonSchemaInputData> = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    price: { type: "string" },
  },
  required: ["id", "name", "price"],
};

export default defineBenchmarks({
  library: {
    name: "ajv",
    optimizeType: "jit",
    version: await getVersion("ajv"),
  },
  initialization: {
    run() {
      return ajv.compile(getAjvSchema());
    },
    snippet: ts`ajv.compile({...})`,
  },
  validation: [
    {
      run(data) {
        return ajv.validate(schema, data);
      },
      note: "validate",
      snippet: ts`ajv.validate(schema, data)`,
    },
    {
      run(data) {
        return validate(data);
      },
      note: "compile",
      snippet: ts`
        // const validate = ajv.compile(schema);
        validate(data);
      `,
    },
  ],
  jsonSchema: {
    // ajv consumes JSON Schema, so the schema is the JSON schema - but it can't describe a codec's
    // output type
    generate: ({ target, direction }) => {
      assertJsonSchemaTarget(target, ["draft-2020-12", "draft-07"]);
      if (direction === "output") {
        throw new Error("No JSON schema can be generated for the output type");
      }
      return jsonSchemaSubject;
    },
    snippet: () => ts`{ type: "object", properties: { ... } }`,
    source: "is-json-schema",
  },
  string: {
    "date-time": createStringBenchmark("date-time"),
    date: createStringBenchmark("date"),
    time: createStringBenchmark("time"),
    duration: createStringBenchmark("duration"),
    email: createStringBenchmark("email"),
    url: createStringBenchmark("url"),
    uuid: createStringBenchmark("uuid"),
    ipv4: createStringBenchmark("ipv4"),
    ipv6: createStringBenchmark("ipv6"),
  },
  stack: {
    throw: (data) => {
      validate(data);
      throw new ValidationError(validate.errors || []);
    },
    snippet: ts`
      // const validate = ajv.compile(schema);
      validate(data);
      throw new ValidationError(validate.errors || []);
    `,
  },
});
