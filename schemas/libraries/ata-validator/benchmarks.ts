import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { JSONSchemaType } from "ajv";
import type { FormatName } from "ajv-formats";
import { Validator } from "ata-validator";
import { t } from "ata-validator/t";
import ts from "dedent";

import type { ProductData, StringBenchmarkConfig } from "#src";
import { assertJsonSchemaTarget, defineBenchmarks } from "#src";

import { getAtaValidatorSchema } from ".";

const createStringBenchmark = (format: FormatName): StringBenchmarkConfig => ({
  create() {
    const schema = new Validator({ type: "string", format } satisfies JSONSchemaType<string>);
    return (testString) => schema.isValidObject(testString);
  },
  snippet: ts`{ type: "string", format: "${format}" }`,
});

const schema = getAtaValidatorSchema();

const jsonSchemaSubject = t.object({
  id: t.number(),
  name: t.string(),
  price: t.string(),
});

export default defineBenchmarks({
  library: {
    name: "ata-validator",
    optimizeType: "jit",
    version: await getVersion("ata-validator"),
  },
  initialization: {
    run() {
      return getAtaValidatorSchema();
    },
    snippet: ts`new Validator({...})`,
  },
  validation: {
    run(data) {
      return schema.isValidObject(data);
    },
    snippet: ts`schema.isValidObject(data)`,
  },
  parsing: {
    allErrors: {
      run(data) {
        return schema.validate(data);
      },
      validateResult: (result) => result.valid,
      snippet: ts`schema.validate(data)`,
    },
  },
  standard: {
    allErrors: {
      schema: schema as StandardSchemaV1<unknown, ProductData>, // supports standard schema, but doesn't narrow the type
    },
  },
  jsonSchema: {
    // ata-validator's schemas are JSON Schema, so there's nothing to convert - but a codec's output
    // type has no representation
    generate: ({ target, direction }) => {
      assertJsonSchemaTarget(target, ["draft-2020-12", "draft-07"]);
      if (direction === "output") {
        throw new Error("No JSON schema can be generated for the output type");
      }
      return jsonSchemaSubject;
    },
    snippet: () => ts`t.object({ ... })`,
    source: "is-json-schema",
  },
  string: {
    "date-time": createStringBenchmark("date-time"),
    date: createStringBenchmark("date"),
    time: createStringBenchmark("time"),
    duration: createStringBenchmark("duration"),
    email: createStringBenchmark("email"),
    uuid: createStringBenchmark("uuid"),
    ipv4: createStringBenchmark("ipv4"),
    ipv6: createStringBenchmark("ipv6"),
  },
});
