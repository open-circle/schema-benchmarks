import { defineBenchmarks } from "@schema-benchmarks/schemas";
import { getVersion } from "@schema-benchmarks/utils/node" with {
  type: "macro",
};
import ts from "dedent" with { type: "macro" };
import { getAjv, getAjvSchema } from ".";

const schema = getAjvSchema();
const ajv = getAjv();
const validate = ajv.compile(schema);

export default defineBenchmarks({
  library: {
    name: "ajv",
    type: "runtime",
    version: await getVersion("ajv"),
  },
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
