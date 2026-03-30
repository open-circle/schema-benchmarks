import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import type { StandardSchemaV1 } from "@standard-schema/spec";
import ts from "dedent";

import type { ProductData } from "#src";
import { defineBenchmarks } from "#src";

import { getAtaValidatorSchema } from ".";

const schema = getAtaValidatorSchema();

export default defineBenchmarks({
  library: {
    name: "ata-validator",
    git: "DZakh/ata-validator",
    optimizeType: "none",
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
});
