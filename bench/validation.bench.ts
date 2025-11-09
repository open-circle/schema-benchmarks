import * as v from "valibot";
import typia from "typia";
import { describe, bench } from "vitest";
import { getArkTypeSchema } from "./schemas/arktype";
import { getValibotSchema } from "./schemas/valibot";
import { getZodSchema } from "./schemas/zod";
import { TypiaSchema } from "./schemas/typia";
import { successData, errorData } from "@schema-benchmarks/data";
import z from "zod";

const arktypeSchema = getArkTypeSchema();

const valibotSchema = getValibotSchema();

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

  for (const jitless of [false, true]) {
    z.config({ jitless });
    const zodSchema = getZodSchema();
    bench("zod" + (jitless ? " (jitless)" : ""), () => {
      zodSchema.safeParse(data);
    });
  }
  z.config({ jitless: false });

  bench("typia", () => {
    typia.validate<TypiaSchema>(data);
  });
});
