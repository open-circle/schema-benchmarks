import { jsonSchemaToType } from "@ark/json-schema";
import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import { type } from "arktype";
import ts from "dedent";

import type { StringBenchmarkConfig } from "#src";
import { assertJsonSchemaTarget, assertNotReached, defineBenchmarks } from "#src";

import { getArkTypeSchema } from ".";

type Format =
  | Exclude<keyof typeof type.keywords.string, ` ${string}`>
  | `ip.v${4 | 6}`
  | "date.iso";

const createStringBenchmark = (format: Format): StringBenchmarkConfig => ({
  create() {
    return type(`string.${format}`).allows;
  },
  snippet: ts`type("string.${format}")`,
});

const schema = getArkTypeSchema();
const jsonSchemaSubject = type({
  id: "number",
  name: "string",
  // `string.numeric.parse` would also validate the string, which no other subject does. The output
  // type has to be declared, or it's unknown - and so is the JSON schema of the output
  price: type("string").pipe(Number, type("number")),
});

export default defineBenchmarks({
  library: {
    name: "arktype",
    optimizeType: "jit",
    version: await getVersion("arktype"),
  },
  initialization: {
    run() {
      return getArkTypeSchema();
    },
    snippet: ts`type(...)`,
  },
  validation: {
    run(data) {
      return schema.allows(data);
    },
    snippet: ts`schema.allows(data)`,
  },
  parsing: {
    allErrors: {
      run(data) {
        return schema(data);
      },
      validateResult: (result) => !(result instanceof type.errors),
      snippet: ts`schema(data)`,
    },
  },
  standard: {
    allErrors: { schema },
  },
  jsonSchema: {
    conversion: {
      toJson: {
        generate: ({ target, direction }) => {
          assertJsonSchemaTarget(target, ["draft-2020-12", "draft-07"]);
          return (
            direction === "input" ? jsonSchemaSubject.in : jsonSchemaSubject.out
          ).toJsonSchema({
            target,
          });
        },
        snippet: ({ target, direction }) =>
          ts`schema.${direction === "input" ? "in" : "out"}.toJsonSchema({ target: "${target}" })`,
        source: { type: "native" },
        standardJsonSchema: { type: "native", schema: jsonSchemaSubject },
      },
      fromJson: {
        generate: (jsonSchema) => jsonSchemaToType(jsonSchema),
        snippet: ts`jsonSchemaToType(jsonSchema)`,
      },
    },
  },
  string: {
    "date-time": createStringBenchmark("date.iso"),
    email: createStringBenchmark("email"),
    url: createStringBenchmark("url"),
    uuid: createStringBenchmark("uuid"),
    ipv4: createStringBenchmark("ip.v4"),
    ipv6: createStringBenchmark("ip.v6"),
  },
  stack: {
    throw: (data) => {
      schema.assert(data);
      assertNotReached();
    },
    snippet: ts`schema.assert(data)`,
  },
});
