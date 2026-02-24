import { errorData, successData } from "@schema-benchmarks/schemas";
import { libraries } from "@schema-benchmarks/schemas/libraries";
import { ensureArray } from "@schema-benchmarks/utils";
import { assert, describe, expect, it } from "vitest";

expect.addSnapshotSerializer({
  test: (val) => val instanceof Date,
  // we don't care about the value, just that it's a date
  serialize: () => "<Date>",
});

describe.each(Object.entries(libraries))("%s", async (_name, getConfig) => {
  const config = await getConfig();
  const context = await config.createContext();

  describe.runIf(config.standard)("standard", () => {
    describe.each(Object.entries(config.standard ?? {}))("%s", (_errorType, configs) => {
      describe.each(ensureArray(configs))("config %$", (config) => {
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
});
