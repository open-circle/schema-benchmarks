import type {
  JsonSchemaDirection,
  JsonSchemaConversionTarget,
  SchemaConversionToJsonConfig,
  LibraryInfo,
  InitializationBenchmarkConfig,
  ValidationBenchmarkConfig,
  ParsingBenchmarkConfig,
  StandardSchemaBenchmarkConfig,
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
import type { MaybeArray, MaybePromise, OneOf } from "@schema-benchmarks/utils";
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

const expectUniqueNotes = (configs: ReadonlyArray<{ note?: string }>) => {
  const notes = configs.map(({ note }) => note);
  expect(new Set(notes).size).toBe(notes.length);
};

/** Compiles a generated JSON schema, so it can be checked against the data it describes. */
const compileJsonSchema = (target: JsonSchemaConversionTarget, jsonSchema: object) => {
  // formats are library specific (e.g. `url` vs `uri`), and OpenAPI keywords aren't JSON Schema
  const options = { strict: false, validateFormats: false };
  const ajv = target === "draft-2020-12" ? new Ajv2020(options) : new Ajv(options);
  return ajv.compile(jsonSchema);
};

type KnownOutcomeConfig = OneOf<
  | InitializationBenchmarkConfig
  | ValidationBenchmarkConfig
  | ParsingBenchmarkConfig
  | StandardSchemaBenchmarkConfig
>;

type KnownOutcome =
  | string
  | MaybeArray<{
      when: (libraryInfo: LibraryInfo, config: KnownOutcomeConfig) => boolean;
      reason: string;
    }>;

type KnownOutcomes = {
  success?: Partial<Record<keyof typeof successCases, KnownOutcome>>;
  failure?: Partial<Record<keyof typeof failureCases, KnownOutcome>>;
};

const knownOutcomes: Record<string, KnownOutcomes> = {
  yup: {
    failure: {
      "title: not a string": {
        when: (_, config) => config.note !== "strict",
        reason: "coerces to string",
      },
    },
  },
};

function resolveKnownOutcome<Type extends keyof KnownOutcomes>(
  libraryInfo: LibraryInfo,
  config: KnownOutcomeConfig,
  type: Type,
  caseName: keyof NonNullable<KnownOutcomes[Type]>,
): string | undefined {
  const knownOutcome: KnownOutcome | undefined =
    // @ts-expect-error
    knownOutcomes[libraryInfo.name]?.[type]?.[caseName];
  if (!knownOutcome) return undefined;
  if (typeof knownOutcome === "string") return knownOutcome;
  for (const { when, reason } of ensureArray(knownOutcome)) {
    if (when(libraryInfo, config)) return reason;
  }
  return undefined;
}

const itChecksAllRefinements = (
  libraryInfo: LibraryInfo,
  config: KnownOutcomeConfig,
  validate: (data: unknown) => MaybePromise<boolean>,
) => {
  for (const [caseName, data] of unsafeEntries(successCases)) {
    const knownOutcome = resolveKnownOutcome(libraryInfo, config, "success", caseName);
    const expected = !knownOutcome;
    const suffix = knownOutcome ? ` (${knownOutcome})` : "";

    it(`${caseName}${suffix}`, async () => {
      await expect(promiseTry(() => validate(data))).resolves.toBe(expected);
    });
  }
  for (const [caseName, data] of unsafeEntries(failureCases)) {
    const knownOutcome = resolveKnownOutcome(libraryInfo, config, "failure", caseName);
    const expected = !!knownOutcome;
    const suffix = knownOutcome ? ` (${knownOutcome})` : "";

    it(`${caseName}${suffix}`, async () => {
      await expect(promiseTry(() => validate(data))).resolves.toBe(expected);
    });
  }
};

describe.each(Object.entries(libraries))("%s", async (_name, getConfig) => {
  const libConfig = await getConfig();
  const { library } = libConfig;

  const configArrays = [
    ["initialization", libConfig.initialization],
    ["validation", libConfig.validation],
    ...Object.entries(libConfig.parsing ?? {}).map(
      ([errorType, configs]) => [`parsing ${errorType}`, configs] as const,
    ),
    ...Object.entries(libConfig.standard ?? {}).map(
      ([errorType, configs]) => [`standard ${errorType}`, configs] as const,
    ),
    ["JSON schema toJson", libConfig.jsonSchema?.conversion?.toJson],
    ["JSON schema fromJson", libConfig.jsonSchema?.conversion?.fromJson],
    ["JSON schema compliance validation", libConfig.jsonSchema?.compliance?.validation],
    ["JSON schema compliance semantics", libConfig.jsonSchema?.compliance?.semantics],
    ["JSON schema compliance roundtrip", libConfig.jsonSchema?.compliance?.roundtrip],
    ["codec", libConfig.codec],
  ] as const;

  for (const [name, configs] of configArrays) {
    if (Array.isArray(configs)) {
      it(`${name} configs should have unique notes`, () => {
        expectUniqueNotes(configs);
      });
    }
  }

  describe.runIf(libConfig.initialization)("initialization", () => {
    describe.each(ensureArray(libConfig.initialization ?? []))("config %#", (config) => {
      it("should initialize", async () => {
        const result = await config.run();
        expect(result).toBeDefined();
      });
    });
  });

  describe.runIf(libConfig.validation)("validation", () => {
    describe.each(ensureArray(libConfig.validation ?? []))("config %#", (config) => {
      it.each([
        [true, "valid", successData],
        [false, "invalid", errorData],
      ] as const)("should return %s for %s data", async (expected, _dataType, data) => {
        expect(config.run(data)).toBe(expected);
      });

      itChecksAllRefinements(library, config, config.run);
    });
  });

  describe.runIf(libConfig.parsing)("parsing", () => {
    describe.each(Object.entries(libConfig.parsing ?? {}))("%s", (_errorType, configs) => {
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
        itChecksAllRefinements(library, config, async (data) => {
          const result = await config.run(data);
          return config.validateResult(result);
        });
      });
    });
  });

  describe.runIf(libConfig.standard)("standard", () => {
    describe.each(Object.entries(libConfig.standard ?? {}))("%s", (_errorType, configs) => {
      describe.each(ensureArray(configs))("config %#", (config) => {
        const { schema } = config;
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
        itChecksAllRefinements(library, config, async (data) => {
          const result = await schema["~standard"].validate(data);
          return !result.issues?.length;
        });
      });
    });
  });
  describe.runIf(libConfig.jsonSchema?.conversion?.toJson)("JSON schema toJson", () => {
    // the parameter is typed, so a renamed field fails to compile instead of silently skipping
    describe.each(ensureArray(libConfig.jsonSchema?.conversion?.toJson ?? []))(
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
  describe.runIf(libConfig.jsonSchema?.conversion?.fromJson)("JSON schema fromJson", () => {
    describe.each(ensureArray(libConfig.jsonSchema?.conversion?.fromJson ?? []))(
      "config %#",
      ({ generate }) => {
        it("should return a result", () => {
          expect(generate(fromJsonBenchSchema)).toBeDefined();
        });
      },
    );
  });
  describe.runIf(libConfig.string)("string", () => {
    describe.each(unsafeEntries(libConfig.string ?? {}))("%s", (stringType, config) => {
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
  describe.runIf(libConfig.stack)("stack", () => {
    it("should throw", async () => {
      const promise = promiseTry(() => libConfig.stack?.throw(errorData));
      await expect(promise).rejects.toThrow(expect.anything());
      await expect(promise).rejects.not.toThrow(ShouldHaveThrownError);
    });
  });
  describe.runIf(libConfig.codec)("codec", () => {
    describe.each(ensureArray(libConfig.codec ?? []))("config %#", (config) => {
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
