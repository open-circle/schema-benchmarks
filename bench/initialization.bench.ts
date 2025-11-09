import { bench } from "vitest";
import { getArkTypeSchema } from "./schemas/arktype";
import { getValibotSchema } from "./schemas/valibot";
import { getZodSchema } from "./schemas/zod";
import z from "zod";

bench("arktype", () => {
  getArkTypeSchema();
});

bench("valibot", () => {
  getValibotSchema();
});

for (const jitless of [false, true]) {
  z.config({ jitless });
  bench("zod" + (jitless ? " (jitless)" : ""), () => {
    getZodSchema();
  });
}
z.config({ jitless: false });
