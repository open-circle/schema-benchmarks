import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import addFormats from "ajv-formats";
import ts from "dedent" with { type: "macro" };

import { defineBenchmarks } from "#src";

import { getAjv, getAjvSchema } from ".";

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
    email: {
      create({ ajv }) {
        addFormats(ajv, { formats: ["email"] });
        return ajv.compile({ type: "string", format: "email" } as const);
      },
      snippet: ts`{ type: "string", format: "email" }`,
    },
    url: {
      create({ ajv }) {
        addFormats(ajv, { formats: ["url"] });
        return ajv.compile({ type: "string", format: "url" } as const);
      },
      snippet: ts`{ type: "string", format: "url" }`,
    },
    uuid: {
      create({ ajv }) {
        addFormats(ajv, { formats: ["uuid"] });
        return ajv.compile({ type: "string", format: "uuid" } as const);
      },
      snippet: ts`{ type: "string", format: "uuid" }`,
    },
  },
});
