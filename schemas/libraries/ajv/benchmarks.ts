import { defineBenchmarks } from "@schema-benchmarks/schemas";
import ts from "dedent" with { type: "macro" };
import { getVersion } from "../../src/version" with { type: "macro" };
import { getAjv, getAjvSchema } from ".";

const schema = getAjvSchema();
const ajv = getAjv();
const validate = ajv.compile(schema);

export default defineBenchmarks({
  libraryName: "ajv",
  libraryType: "runtime",
  libraryVersion: await getVersion("ajv"),
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
      note: "validate",
      snippet: ts`ajv.validate(schema, data)`,
    },
    {
      run(data) {
        validate(data);
      },
      note: "compile",
      snippet: ts`
        // const validate = ajv.compile(schema);
        validate(data);
      `,
    },
  ],
});
