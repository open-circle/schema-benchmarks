import { defineBenchmarks } from "@schema-benchmarks/schemas";
import ts from "dedent" with { type: "macro" };
import { getVersion } from "../../src/version" with { type: "macro" };
import { getJoiSchema } from ".";

const schema = getJoiSchema();

export default defineBenchmarks({
  libraryName: "joi",
  libraryType: "runtime",
  libraryVersion: await getVersion("joi"),
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
