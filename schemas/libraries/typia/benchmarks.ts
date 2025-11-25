import { defineBenchmarks } from "@schema-benchmarks/schemas";
import { getVersion } from "@schema-benchmarks/utils/node" with {
  type: "macro",
};
import ts from "dedent" with { type: "macro" };
import typia from "typia";
import type { TypiaSchema } from ".";

const validate = typia.createValidate<TypiaSchema>();
const is = typia.createIs<TypiaSchema>();

export default defineBenchmarks({
  library: {
    name: "typia",
    type: "precompiled",
    version: await getVersion("typia"),
  },
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
