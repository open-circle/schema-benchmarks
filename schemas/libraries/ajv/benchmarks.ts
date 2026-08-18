import remotes from "@schema-benchmarks/json-schema-tests/remotes";
import type { ComplianceTarget } from "@schema-benchmarks/json-schema-tests/types";
import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import type { JSONSchemaType } from "ajv";
import { Ajv, ValidationError } from "ajv";
import Ajv4 from "ajv-draft-04";
import type { FormatName } from "ajv-formats";
import addFormats from "ajv-formats";
import Ajv2019 from "ajv/dist/2019";
import Ajv2020 from "ajv/dist/2020";
import ts from "dedent";

import type { StringBenchmarkConfig } from "#src";
import { defineBenchmarks } from "#src";

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

function getComplianceAjv({ strict, target }: { strict: boolean; target: ComplianceTarget }) {
  const sharedOpts = { strict, validateSchema: false, logger: false as const };
  switch (target) {
    case "draft4":
      return new Ajv4(sharedOpts);
    case "draft2019-09":
      return new Ajv2019(sharedOpts);
    case "draft2020-12":
      return new Ajv2020(sharedOpts);
    default:
      return new Ajv(sharedOpts);
  }
}

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
  jsonSchema: {
    compliance: {
      validation: [
        {
          run(schema, data, { target }) {
            const complianceAjv = getComplianceAjv({ strict: true, target });
            addFormats(complianceAjv);
            for (const [uri, remoteSchema] of Object.entries(remotes)) {
              complianceAjv.addSchema(remoteSchema, uri);
            }
            return complianceAjv.validate(schema, data);
          },
          snippet: () => ts`
          const ajv = new Ajv({ validateSchema: false });
          addFormats(ajv);
          for (const [uri, remoteSchema] of Object.entries(remotes)) {
            ajv.addSchema(remoteSchema, uri);
          }
          return ajv.validate(schema, data)`,
          source: { type: "native" },
        },
        {
          run(schema, data, { target }) {
            const complianceAjv = getComplianceAjv({ strict: false, target });
            addFormats(complianceAjv);
            for (const [uri, remoteSchema] of Object.entries(remotes)) {
              complianceAjv.addSchema(remoteSchema, uri);
            }
            return complianceAjv.validate(schema, data);
          },
          snippet: () => ts`
          const ajv = new Ajv({ strict: false, validateSchema: false });
          addFormats(ajv);
          for (const [uri, remoteSchema] of Object.entries(remotes)) {
            ajv.addSchema(remoteSchema, uri);
          }
          return ajv.validate(schema, data)`,
          source: { type: "native" },
          note: "non-strict",
        },
      ],
    },
  },
});
