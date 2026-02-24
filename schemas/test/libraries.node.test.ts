import { errorData, successData, validStrings, invalidStrings } from "@schema-benchmarks/schemas";
import { libraries } from "@schema-benchmarks/schemas/libraries";
import { ensureArray, unsafeEntries } from "@schema-benchmarks/utils";
import { assert, describe, expect, it } from "vitest";

describe.each(Object.entries(libraries))("%s", async (_name, getConfig) => {
  const config = await getConfig();
  const context = await config.createContext();

  describe("initialization", () => {
    describe.each(ensureArray(config.initialization))("config %o", (config) => {
      it("should initialize", async () => {
        const result = await config.run(context);
        expect(result).toBeDefined();
      });
    });
  });

  describe.runIf(config.validation)("validation", () => {
    describe.each(ensureArray(config.validation ?? []))("config %o", (config) => {
      it.each([
        [true, "valid", successData],
        [false, "invalid", errorData],
      ] as const)("should return %s for %s data", async (expected, _dataType, data) => {
        expect(config.run(data, context)).toBe(expected);
      });
    });
  });

  describe.runIf(config.parsing)("parsing", () => {
    describe.each(Object.entries(config.parsing ?? {}))("%s", (_errorType, configs) => {
      describe.each(ensureArray(configs))("config %o", (config) => {
        it.each([
          [true, "valid", successData],
          [false, "invalid", errorData],
        ] as const)("should return %s for %s data", async (expected, _dataType, data) => {
          const result = await config.run(data, context);
          expect(config.validateResult(result)).toBe(expected);
        });
      });
    });
  });

  describe.runIf(config.standard)("standard", () => {
    describe.each(Object.entries(config.standard ?? {}))("%s", (_errorType, configs) => {
      describe.each(ensureArray(configs))("config %o", (config) => {
        it("should create a schema", async () => {
          const schema = await config.getSchema(context);
          expect(schema["~standard"]).toBeDefined();
          expect(schema["~standard"]).toHaveProperty("version", expect.any(Number));
          expect(schema["~standard"]).toHaveProperty("vendor", expect.any(String));
          expect(schema["~standard"]).toHaveProperty("validate", expect.any(Function));
        });
        it("should return a successful result for valid data", async () => {
          const schema = await config.getSchema(context);
          const result = await schema["~standard"].validate(successData);
          expect(result.issues).toBeUndefined();
          assert(!result.issues); // typescript
          expect(result.value).toEqual(successData);
        });
        it("should return an error result for invalid data", async () => {
          const schema = await config.getSchema(context);
          const result = await schema["~standard"].validate(errorData);
          expect(result.issues).toBeDefined();
          expect(result.issues?.length).toBeGreaterThan(0);
        });
      });
    });
  });
  describe.runIf(config.string)("string", () => {
    describe.each(unsafeEntries(config.string ?? {}))("%s", (stringType, config) => {
      assert(config);
      it.each([
        [true, validStrings],
        [false, invalidStrings],
      ] as const)("should return %s for %s data", async (expected, strings) => {
        expect(config.create(context)(strings[stringType])).toBe(expected);
      });
    });
  });
});
