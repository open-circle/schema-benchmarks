import { defineBenchmarks } from "@schema-benchmarks/schemas";
import { getVersion } from "@schema-benchmarks/utils" with { type: "macro" };
import ts from "dedent" with { type: "macro" };
import { getJoiSchema } from ".";

const schema = getJoiSchema();

export default defineBenchmarks({
  library: {
    name: "joi",
    type: "runtime",
    version: await getVersion("joi"),
  },
  initialization: {
    run() {
      getJoiSchema();
    },
    snippet: ts`object(...)`,
  },
  validation: {
    run(data) {
      schema.validate(data);
    },
    snippet: ts`schema.validate(data)`,
  },
  parsing: {
    allErrors: {
      run(data) {
        schema.validate(data, { abortEarly: false });
      },
      snippet: ts`schema.validate(data, { abortEarly: false })`,
    },
    abortEarly: {
      run(data) {
        schema.validate(data, { abortEarly: true });
      },
      snippet: ts`schema.validate(data, { abortEarly: true })`,
    },
  },
});
