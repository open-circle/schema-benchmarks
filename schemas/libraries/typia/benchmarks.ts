import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
// @ts-expect-error imported for type portability
// oxlint-disable-next-line no-unused-vars
import type { StandardSchemaV1 } from "@standard-schema/spec";
import ts from "dedent";
import typia, { type tags } from "typia";

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
        return typia.createValidate<TypiaSchema>();
      },
      note: "createValidate",
      snippet: ts`typia.createValidate<TypiaSchema>()`,
    },
    {
      run() {
        return typia.createIs<TypiaSchema>();
      },
      note: "createIs",
      snippet: ts`typia.createIs<TypiaSchema>()`,
    },
  ],
  validation: [
    {
      run(data) {
        return typia.is<TypiaSchema>(data);
      },
      note: "is",
      snippet: ts`typia.is<TypiaSchema>(data)`,
    },
    {
      run(data, { is }) {
        return is(data);
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
          return typia.validate<TypiaSchema>(data);
        },
        validateResult: (result) => result.success,
        note: "validate",
        snippet: ts`typia.validate<TypiaSchema>(data)`,
      },
      {
        run(data, { validate }) {
          return validate(data);
        },
        validateResult: (result) => result.success,
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
  string: {
    email: {
      create() {
        return typia.createIs<string & tags.Format<"email">>();
      },
      snippet: ts`
        // const isEmail = typia.createIs<string & tags.Format<"email">>();
        isEmail(testString);
      `,
    },
    url: {
      create() {
        return typia.createIs<string & tags.Format<"url">>();
      },
      snippet: ts`
        // const isUrl = typia.createIs<string & tags.Format<"url">>();
        isUrl(testString);
      `,
    },
    uuid: {
      create() {
        return typia.createIs<string & tags.Format<"uuid">>();
      },
      snippet: ts`
        // const isUuid = typia.createIs<string & tags.Format<"uuid">>();
        isUuid(testString);
      `,
    },
    ipv4: {
      create() {
        return typia.createIs<string & tags.Format<"ipv4">>();
      },
      snippet: ts`
        // const isIpv4 = typia.createIs<string & tags.Format<"ipv4">>();
        isIpv4(testString);
      `,
    },
    ipv6: {
      create() {
        return typia.createIs<string & tags.Format<"ipv6">>();
      },
      snippet: ts`
        // const isIpv6 = typia.createIs<string & tags.Format<"ipv6">>();
        isIpv6(testString);
      `,
    },
  },
});
