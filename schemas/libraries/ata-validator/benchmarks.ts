import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { FormatName } from "ajv-formats";
import { Validator } from "ata-validator";
import ts from "dedent";

import type { ProductData, StringBenchmarkConfig } from "#src";
import { defineBenchmarks } from "#src";

import { getAtaValidatorSchema } from ".";

const createStringBenchmark = (format: FormatName): StringBenchmarkConfig => ({
  create() {
    const schema = new Validator({ type: "string", format } as const);
    return (testString) => schema.isValidObject(testString);
  },
  snippet: ts`{ type: "string", format: "${format}" }`,
});

const schema = getAtaValidatorSchema();

export default defineBenchmarks({
  library: {
    name: "ata-validator",
    git: "ata-core/ata-validator",
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
});
