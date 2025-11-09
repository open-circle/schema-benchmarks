import { describe, bench } from "vitest";
import { getArkTypeSchema } from "./schemas/arktype";
import { getValibotSchema } from "./schemas/valibot";
import { getZodSchema } from "./schemas/zod";

describe("Initialization", () => {
  bench("arktype", () => {
    getArkTypeSchema();
  });
  bench("valibot", () => {
    getValibotSchema();
  });
  bench("zod", () => {
    getZodSchema();
  });
});
