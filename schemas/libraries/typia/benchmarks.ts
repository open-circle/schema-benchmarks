import { defineBenchmarks } from "@schema-benchmarks/schemas";
import ts from "dedent";
import typia from "typia";
import type { TypiaSchema } from ".";

const validate = typia.createValidate<TypiaSchema>();
const is = typia.createIs<TypiaSchema>();

export default defineBenchmarks({
  libraryName: "typia",
  libraryType: "precompiled",
  initialization: [
    {
      run() {
        typia.createValidate<TypiaSchema>();
      },
      snippet: ts`typia.createValidate<TypiaSchema>()`,
    },
    {
      run() {
        typia.createIs<TypiaSchema>();
      },
      snippet: ts`typia.createIs<TypiaSchema>()`,
    },
  ],
  validation: [
    {
      run(data) {
        typia.is<TypiaSchema>(data);
      },
      snippet: ts`typia.is<TypiaSchema>(data)`,
    },
    {
      run(data) {
        is(data);
      },
      snippet: ts`
        // const is = typia.createIs<TypiaSchema>();
        is(data);
      `,
    },
  ],
  parsing: {
    allErrors: [
      {
        run(data) {
          typia.validate<TypiaSchema>(data);
        },
        snippet: ts`typia.validate<TypiaSchema>(data)`,
      },
      {
        run(data) {
          validate(data);
        },
        snippet: ts`
          // const validate = typia.createValidate<TypiaSchema>();
          validate(data);
        `,
      },
    ],
  },
});
