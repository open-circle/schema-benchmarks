import typia from "typia";
import { bench, describe } from "vitest";
import z from "zod";
import { getArkTypeSchema } from "./schemas/arktype";
import type { TypiaSchema } from "./schemas/typia";
import { getValibotSchema } from "./schemas/valibot";
import { getZodSchema } from "./schemas/zod";

describe("runtime", () => {
	bench("arktype", () => {
		getArkTypeSchema();
	});

	bench("valibot", () => {
		getValibotSchema();
	});

	for (const jitless of [false, true]) {
		z.config({ jitless });
		bench(`zod${jitless ? " (jitless)" : ""}`, () => {
			getZodSchema();
		});
	}
	z.config({ jitless: false });
});

describe("precompiled", () => {
	bench("typia", () => {
		typia.createValidate<TypiaSchema>();
	});
});
