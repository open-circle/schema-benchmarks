import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import type Ajv from "ajv";
import type { FormatName } from "ajv-formats";
import addFormats from "ajv-formats";
import ts from "dedent";

import type { StringBenchmarkConfig } from "#src";
import { defineBenchmarks } from "#src";

import { getAjv, getAjvSchema } from ".";

const createStringBenchmark = (format: FormatName): StringBenchmarkConfig<{ ajv: Ajv }> => ({
  create({ ajv }) {
    addFormats(ajv, { formats: [format] });
    return ajv.compile({ type: "string", format } as const);
  },
  snippet: ts`{ type: "string", format: "${format}" }`,
});

export default defineBenchmarks({
  library: {
    name: "ajv",
    git: "ajv-validator/ajv",
    optimizeType: "jit",
    version: await getVersion("ajv"),
  },
  createContext: () => {
    const ajv = getAjv();
    const schema = getAjvSchema();
    const validate = ajv.compile(schema);
    return { ajv, schema, validate };
  },
  initialization: {
    run({ ajv }) {
      return ajv.compile(getAjvSchema());
    },
    snippet: ts`ajv.compile({...})`,
  },
  validation: [
    {
      run(data, { ajv, schema }) {
        return ajv.validate(schema, data);
      },
      note: "validate",
      snippet: ts`ajv.validate(schema, data)`,
    },
    {
      run(data, { validate }) {
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
    email: createStringBenchmark("email"),
    url: createStringBenchmark("url"),
    uuid: createStringBenchmark("uuid"),
    ipv4: createStringBenchmark("ipv4"),
    ipv6: createStringBenchmark("ipv6"),
  },
});
