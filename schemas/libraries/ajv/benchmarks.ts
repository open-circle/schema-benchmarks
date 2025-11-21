import { defineBenchmarks } from "@schema-benchmarks/schemas";
import ts from "dedent";
import { getAjv, getAjvSchema } from ".";

const schema = getAjvSchema();
const ajv = getAjv();
const validate = ajv.compile(schema);

export default defineBenchmarks({
  libraryName: "ajv",
  libraryType: "runtime",
  initialization: {
    run() {
      ajv.compile(getAjvSchema());
    },
    snippet: ts`ajv.compile({...})`,
  },
  validation: [
    {
      run(data) {
        ajv.validate(schema, data);
      },
      snippet: ts`ajv.validate(schema, data)`,
    },
    {
      run(data) {
        validate(data);
      },
      snippet: ts`
        // const validate = ajv.compile(schema);
        validate(data);
      `,
    },
  ],
});
