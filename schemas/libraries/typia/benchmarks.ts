import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
// @ts-expect-error imported for type portability
// oxlint-disable-next-line no-unused-vars
import type { StandardSchemaV1 } from "@standard-schema/spec";
import ts from "dedent";
import typia, { type tags } from "typia";

import {
  assertJsonSchemaDirection,
  assertJsonSchemaTarget,
  assertNotReached,
  defineBenchmarks,
} from "#src";

import type { TypiaSchema } from ".";

const validate = typia.createValidate<TypiaSchema>();
const is = typia.createIs<TypiaSchema>();
const assert = typia.createAssert<TypiaSchema>();

// typia's transform needs the type locally, so it can't be imported from #src
interface JsonSchemaSubject {
  id: number;
  name: string;
  price: string;
}

// generated at build time - OpenAPI 3.1 schemas are JSON Schema 2020-12. `schema` is the JSON
// schema itself, alongside the named types it can reference
const openApi30 = typia.json.schema<JsonSchemaSubject, "3.0">().schema;
const openApi31 = typia.json.schema<JsonSchemaSubject>().schema;

export default defineBenchmarks({
  library: {
    name: "typia",
    optimizeType: "precompiled",
    version: await getVersion("typia"),
  },
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
      run(data) {
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
        run(data) {
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
      schema: validate,
      snippet: ts`
        // const validate = typia.createValidate<TypiaSchema>();
        upfetch(url, { schema: validate })
      `,
    },
  },
  jsonSchema: {
    conversion: {
      toJson: {
        generate: ({ target, direction }) => {
          assertJsonSchemaTarget(target, ["draft-2020-12", "openapi-3.0"]);
          assertJsonSchemaDirection(direction, ["input"]);
          return target === "openapi-3.0" ? openApi30 : openApi31;
        },
        snippet: ({ target }) =>
          ts`typia.json.schema<Schema, "${target === "openapi-3.0" ? "3.0" : "3.1"}">().schema`,
        source: "precompiled",
      },
    },
  },
  string: {
    "date-time": {
      create() {
        return typia.createIs<string & tags.Format<"date-time">>();
      },
      snippet: ts`string & tags.Format<"date-time">`,
    },
    date: {
      create() {
        return typia.createIs<string & tags.Format<"date">>();
      },
      snippet: ts`string & tags.Format<"date">`,
    },
    time: {
      create() {
        return typia.createIs<string & tags.Format<"time">>();
      },
      snippet: ts`string & tags.Format<"time">`,
    },
    duration: {
      create() {
        return typia.createIs<string & tags.Format<"duration">>();
      },
      snippet: ts`string & tags.Format<"duration">`,
    },
    email: {
      create() {
        return typia.createIs<string & tags.Format<"email">>();
      },
      snippet: ts`string & tags.Format<"email">`,
    },
    url: {
      create() {
        return typia.createIs<string & tags.Format<"url">>();
      },
      snippet: ts`string & tags.Format<"url">`,
    },
    uuid: {
      create() {
        return typia.createIs<string & tags.Format<"uuid">>();
      },
      snippet: ts`string & tags.Format<"uuid">`,
    },
    ipv4: {
      create() {
        return typia.createIs<string & tags.Format<"ipv4">>();
      },
      snippet: ts`string & tags.Format<"ipv4">`,
    },
    ipv6: {
      create() {
        return typia.createIs<string & tags.Format<"ipv6">>();
      },
      snippet: ts`string & tags.Format<"ipv6">`,
    },
  },
  stack: {
    throw: (data) => {
      assert(data);
      assertNotReached();
    },
    snippet: ts`
      // const assert = typia.createAssert<TypiaSchema>();
      assert(data);
    `,
  },
});
