import * as v from "valibot";
import typia from "typia";
import { describe, bench } from "vitest";
import { getArkTypeSchema } from "./schemas/arktype";
import { getValibotSchema } from "./schemas/valibot";
import { getZodSchema } from "./schemas/zod";
import { TypiaSchema } from "./schemas/typia";
import { successData, errorData } from "@schema-benchmarks/data";

describe("Validation", () => {
  const arktypeSchema = getArkTypeSchema();
  const valibotSchema = getValibotSchema();
  const zodSchema = getZodSchema();

  describe.each([
    ["Success", successData],
    ["Error", errorData],
  ])("%s", (_, data) => {
    bench("arktype", () => {
      arktypeSchema(data);
    });
    bench("valibot", () => {
      v.safeParse(valibotSchema, data);
    });
    bench("zod", () => {
      zodSchema.safeParse(data);
    });
    bench("typia", () => {
      typia.validate<TypiaSchema>(data);
    });
  });
});
