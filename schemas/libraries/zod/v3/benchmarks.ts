import { getVersion } from "@schema-benchmarks/utils/node" with { type: "macro" };
import ts from "dedent";
import { zodToJsonSchema } from "zod-to-json-schema";
import * as z from "zod/v3";

import type { JsonSchemaInputData, JsonSchemaConversionTarget, StringBenchmarkConfig } from "#src";
import { assertJsonSchemaTarget, assertNotReached, defineBenchmarks } from "#src";

import { getZodSchema } from ".";

type FormatMethod = {
  [K in keyof z.ZodString]-?: z.ZodString[K] extends () => z.ZodString ? K : never;
}[keyof z.ZodString];

const createStringBenchmark = <Method extends FormatMethod>(
  method: Method,
  snippet = `${method}()`,
  ...args: Parameters<z.ZodString[Method]>
): StringBenchmarkConfig => ({
  create() {
    const schema = z.string()[method](...(args as []));
    return (testString) => schema.safeParse(testString).success;
  },
  snippet: ts`z.string().${snippet}`,
});

const schema = getZodSchema();

const jsonSchemaSubject = z.object({
  id: z.number(),
  name: z.string(),
  price: z.string().transform(Number).pipe(z.number()),
}) satisfies z.ZodType<unknown, z.ZodTypeDef, JsonSchemaInputData>;

// zod-to-json-schema names the targets differently, and has no draft 2020-12
const jsonSchemaTargets = {
  "draft-07": "jsonSchema7",
  "openapi-3.0": "openApi3",
} as const satisfies Partial<Record<JsonSchemaConversionTarget, string>>;
const getJsonSchemaTarget = (target: JsonSchemaConversionTarget) => {
  assertJsonSchemaTarget(target, ["draft-07", "openapi-3.0"]);
  return jsonSchemaTargets[target];
};

export default defineBenchmarks({
  library: {
    name: "zod/v3",
    optimizeType: "none",
    version: await getVersion("zod"),
  },
  initialization: {
    run() {
      return getZodSchema();
    },
    snippet: ts`z.object(...)`,
  },
  parsing: {
    allErrors: [
      {
        run(data) {
          return schema.safeParse(data);
        },
        validateResult: (result) => result.success,
        snippet: ts`schema.safeParse(data)`,
      },
    ],
  },
  standard: {
    allErrors: { schema },
  },
  jsonSchema: {
    conversion: {
      toJson: {
        generate: ({ target, direction }) => {
          return zodToJsonSchema(jsonSchemaSubject, {
            target: getJsonSchemaTarget(target),
            pipeStrategy: direction,
          });
        },
        snippet: ({ target }) =>
          ts`zodToJsonSchema(schema, { target: "${getJsonSchemaTarget(target)}" })`,
        source: { type: "package", package: "zod-to-json-schema" },
      },
    },
  },
  string: {
    "date-time": createStringBenchmark("datetime"),
    date: createStringBenchmark("date"),
    // doesn't allow offset
    // time: createStringBenchmark("time"),
    duration: createStringBenchmark("duration"),
    email: createStringBenchmark("email"),
    url: createStringBenchmark("url"),
    uuid: createStringBenchmark("uuid"),
    ipv4: createStringBenchmark("ip", ts`ip({ version: "v4" })`, { version: "v4" }),
    ipv6: createStringBenchmark("ip", ts`ip({ version: "v6" })`, { version: "v6" }),
  },
  stack: {
    throw: (data) => {
      schema.parse(data);
      assertNotReached();
    },
    snippet: ts`schema.parse(data)`,
  },
});
