import type {
  JsonSchemaDirection,
  JsonSchemaConversionTarget,
  SchemaConversionToJsonConfig,
} from "@schema-benchmarks/schemas";
import {
  errorData,
  failureCases,
  successCases,
  fromJsonBenchSchema,
  jsonSchemaDirectionSchema,
  jsonSchemaInputData,
  jsonSchemaOutputData,
  jsonSchemaConversionTargetSchema,
  successData,
  validStrings,
  invalidStrings,
  ShouldHaveThrownError,
} from "@schema-benchmarks/schemas";
import { libraries } from "@schema-benchmarks/schemas/libraries";
import type { MaybePromise } from "@schema-benchmarks/utils";
import { ensureArray, promiseTry, unsafeEntries } from "@schema-benchmarks/utils";
import { Ajv } from "ajv";
import { Ajv2020 } from "ajv/dist/2020.js";
import { assert, describe, expect, it } from "vitest";

import { acceptedJsonSchemas } from "./accepted-json-schemas.ts";

const jsonSchemaData = {
  input: jsonSchemaInputData,
  output: jsonSchemaOutputData,
} satisfies Record<JsonSchemaDirection, unknown>;

const oppositeDirection = {
  input: "output",
  output: "input",
} satisfies Record<JsonSchemaDirection, JsonSchemaDirection>;

/** Libraries throw for anything they can't convert, which the benchmarks skip. */
const tryGenerate = (generate: () => object) => {
  try {
    return generate();
  } catch {
    return undefined;
  }
};

/** Compiles a generated JSON schema, so it can be checked against the data it describes. */
const compileJsonSchema = (target: JsonSchemaConversionTarget, jsonSchema: object) => {
  // formats are library specific (e.g. `url` vs `uri`), and OpenAPI keywords aren't JSON Schema
  const options = { strict: false, validateFormats: false };
  const ajv = target === "draft-2020-12" ? new Ajv2020(options) : new Ajv(options);
  return ajv.compile(jsonSchema);
};

type KnownOutcomes = {
  success?: Partial<Record<keyof typeof successCases, string>>;
  failure?: Partial<Record<keyof typeof failureCases, string>>;
};

const knownOutcomes: Record<string, KnownOutcomes> = {
  yup: {
    failure: {
      "title: not a string": "coerces to string",
    },
  },
};

const itChecksAllRefinements = (
  libraryName: string,
  validate: (data: unknown) => MaybePromise<boolean>,
) => {
  for (const [caseName, data] of unsafeEntries(successCases)) {
    const knownOutcome = knownOutcomes[libraryName]?.success?.[caseName];
    const expected = !knownOutcome;
    const suffix = knownOutcome ? ` (${knownOutcome})` : "";

    it(`${caseName}${suffix}`, async () => {
      await expect(promiseTry(() => validate(data))).resolves.toBe(expected);
    });
  }
  for (const [caseName, data] of unsafeEntries(failureCases)) {
    const knownOutcome = knownOutcomes[libraryName]?.failure?.[caseName];
    const expected = !!knownOutcome;
    const suffix = knownOutcome ? ` (${knownOutcome})` : "";

    it(`${caseName}${suffix}`, async () => {
      await expect(promiseTry(() => validate(data))).resolves.toBe(expected);
    });
  }
};

describe.each(Object.entries(libraries))("%s", async (_name, getConfig) => {
  const config = await getConfig();
  const { name } = config.library;

  describe.runIf(config.initialization)("initialization", () => {
    describe.each(ensureArray(config.initialization ?? []))("config %#", (config) => {
      it("should initialize", async () => {
        const result = await config.run();
        expect(result).toBeDefined();
      });
    });
  });

  describe.runIf(config.validation)("validation", () => {
    describe.each(ensureArray(config.validation ?? []))("config %#", (config) => {
      it.each([
        [true, "valid", successData],
        [false, "invalid", errorData],
      ] as const)("should return %s for %s data", async (expected, _dataType, data) => {
        expect(config.run(data)).toBe(expected);
      });

      itChecksAllRefinements(name, config.run);
    });
  });

  describe.runIf(config.parsing)("parsing", () => {
    describe.each(Object.entries(config.parsing ?? {}))("%s", (_errorType, configs) => {
      describe.each(ensureArray(configs))("config %#", (config) => {
        it("should return true for valid data", async () => {
          const result = await config.run(successData);
          expect(config.validateResult(result)).toBe(true);
          expect(config.getData(result)).toEqual(successData);
        });
        it("should return false for invalid data", async () => {
          const result = await config.run(errorData);
          expect(config.validateResult(result)).toBe(false);
        });
        itChecksAllRefinements(name, async (data) => {
          const result = await config.run(data);
          return config.validateResult(result);
        });
      });
    });
  });

  describe.runIf(config.standard)("standard", () => {
    describe.each(Object.entries(config.standard ?? {}))("%s", (_errorType, configs) => {
      describe.each(ensureArray(configs))("config %#", ({ schema }) => {
        it("should have a schema", async () => {
          expect(schema["~standard"]).toBeDefined();
          expect(schema["~standard"]).toHaveProperty("version", expect.any(Number));
          expect(schema["~standard"]).toHaveProperty("vendor", expect.any(String));
          expect(schema["~standard"]).toHaveProperty("validate", expect.any(Function));
        });
        it("should return a successful result for valid data", async () => {
          const result = await schema["~standard"].validate(successData);
          expect(result.issues).toBeUndefined();
          assert(!result.issues); // typescript
          expect(result.value).toEqual(successData);
        });
        it("should return an error result for invalid data", async () => {
          const result = await schema["~standard"].validate(errorData);
          expect(result.issues).toBeDefined();
          expect(result.issues?.length).toBeGreaterThan(0);
        });
        itChecksAllRefinements(name, async (data) => {
          const result = await schema["~standard"].validate(data);
          return !result.issues?.length;
        });
      });
    });
  });
  describe.runIf(config.jsonSchema?.conversion?.toJson)("JSON schema toJson", () => {
    // the parameter is typed, so a renamed field fails to compile instead of silently skipping
    describe.each(ensureArray(config.jsonSchema?.conversion?.toJson ?? []))(
      "config %#",
      ({ generate, standardJsonSchema }: SchemaConversionToJsonConfig) => {
        describe.each(jsonSchemaConversionTargetSchema.options)("%s", (target) => {
          describe.each(jsonSchemaDirectionSchema.options)("%s", (direction) => {
            const generated = tryGenerate(() => generate({ target, direction }));

            it.runIf(generated)("should describe the data of that direction", () => {
              assert(generated);
              const validate = compileJsonSchema(target, generated);
              expect(validate(jsonSchemaData[direction])).toBe(true);
              // the schema has a codec, so the other direction's data must not match
              expect(validate(jsonSchemaData[oppositeDirection[direction]])).toBe(false);
            });

            it.runIf(generated)("should generate an accepted schema", () => {
              // a new shape isn't necessarily wrong, but it should be looked at and accepted
              expect(acceptedJsonSchemas[target][direction]).toContainEqual(generated);
            });

            it.runIf(standardJsonSchema)(
              "should generate the same through the standard interface",
              () => {
                assert(standardJsonSchema);
                const standardGenerated = tryGenerate(() =>
                  standardJsonSchema.schema["~standard"].jsonSchema[direction]({ target }),
                );
                // the library can't support the combination through one API and not the other
                expect(Boolean(standardGenerated)).toBe(Boolean(generated));
                if (standardGenerated && generated) {
                  expect(standardGenerated).toEqual(generated);
                }
              },
            );
          });
        });
      },
    );
  });
  describe.runIf(config.jsonSchema?.conversion?.fromJson)("JSON schema fromJson", () => {
    describe.each(ensureArray(config.jsonSchema?.conversion?.fromJson ?? []))(
      "config %#",
      ({ generate }) => {
        it("should return a result", () => {
          expect(generate(fromJsonBenchSchema)).toBeDefined();
        });
      },
    );
  });
  describe.runIf(config.string)("string", () => {
    describe.each(unsafeEntries(config.string ?? {}))("%s", (stringType, config) => {
      assert(config);
      it.each([
        [true, "valid", validStrings],
        [false, "invalid", invalidStrings],
      ] as const)("should return %s for %s data", async (expected, _dataType, strings) => {
        const fn = await config.create();
        const match = await fn(strings[stringType]);
        expect(match).toBe(expected);
      });
    });
  });
  describe.runIf(config.stack)("stack", () => {
    it("should throw", async () => {
      const promise = promiseTry(() => config.stack?.throw(errorData));
      await expect(promise).rejects.toThrow(expect.anything());
      await expect(promise).rejects.not.toThrow(ShouldHaveThrownError);
    });
  });
  describe.runIf(config.codec)("codec", () => {
    describe.each(ensureArray(config.codec ?? []))("config %#", (config) => {
      it("should encode and decode", async () => {
        const { encode, decode } = config;
        const bigint = 1234567890123456789n;
        const encoded = await encode.run(bigint);
        expect(encoded).toBe("1234567890123456789");
        const decoded = await decode.run(encoded);
        // check the bigint is the same
        expect(decoded).toEqual(bigint);
      });
    });
  });
});
