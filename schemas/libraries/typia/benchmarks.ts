import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
// @ts-expect-error imported for type portability
// oxlint-disable-next-line no-unused-vars
import type { StandardSchemaV1 } from "@standard-schema/spec";
import ts from "dedent" with { type: "macro" };
import typia from "typia";

import { defineBenchmarks } from "#src";

import type { TypiaSchema } from ".";

export default defineBenchmarks({
  library: {
    name: "typia",
    git: "samchon/typia",
    optimizeType: "precompiled",
    version: await getVersion("typia"),
  },
  createContext: () => ({
    validate: typia.createValidate<TypiaSchema>(),
    is: typia.createIs<TypiaSchema>(),
  }),
  initialization: [
    {
      run() {
        typia.createValidate<TypiaSchema>();
      },
      note: "createValidate",
      snippet: ts`typia.createValidate<TypiaSchema>()`,
    },
    {
      run() {
        typia.createIs<TypiaSchema>();
      },
      note: "createIs",
      snippet: ts`typia.createIs<TypiaSchema>()`,
    },
  ],
  validation: [
    {
      run(data) {
        typia.is<TypiaSchema>(data);
      },
      note: "is",
      snippet: ts`typia.is<TypiaSchema>(data)`,
    },
    {
      run(data, { is }) {
        is(data);
      },
      note: "createIs",
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
        note: "validate",
        snippet: ts`typia.validate<TypiaSchema>(data)`,
      },
      {
        run(data, { validate }) {
          validate(data);
        },
        note: "createValidate",
        snippet: ts`
          // const validate = typia.createValidate<TypiaSchema>();
          validate(data);
        `,
      },
    ],
  },
  standard: {
    allErrors: {
      getSchema: ({ validate }) => validate,
      snippet: ts`
        // const validate = typia.createValidate<TypiaSchema>();
        upfetch(url, { schema: validate })
      `,
    },
  },
});
