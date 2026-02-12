import { getVersion } from "@schema-benchmarks/utils/node" with {
  type: "macro",
};
import { ValidationError } from "ajv";
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
      ajv.compile(getAjvSchema());
    },
    snippet: ts`ajv.compile({...})`,
  },
  validation: [
    {
      run(data, { ajv, schema }) {
        ajv.validate(schema, data);
      },
      note: "validate",
      snippet: ts`ajv.validate(schema, data)`,
    },
    {
      run(data, { validate }) {
        validate(data);
      },
      note: "compile",
      snippet: ts`
        // const validate = ajv.compile(schema);
        validate(data);
      `,
    },
  ],
  throw({ validate }, data) {
    validate(data);
    throw new ValidationError(validate.errors ?? []);
  },
});
