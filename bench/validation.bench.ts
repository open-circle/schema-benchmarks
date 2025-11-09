import { errorData, successData } from "@schema-benchmarks/data";
import * as Schema from "effect/Schema";
import typia from "typia";
import * as v from "valibot";
import { bench, describe } from "vitest";
import { getArkTypeSchema } from "./schemas/arktype";
import { getEffectSchema } from "./schemas/effect";
import type { TypiaSchema } from "./schemas/typia";
import { getValibotSchema } from "./schemas/valibot";
import { getZodSchema } from "./schemas/zod";
import { getZodMiniSchema } from "./schemas/zod-mini";

describe.each([
	["Success", successData],
	["Error", errorData],
])("%s", (_, data) => {
	describe("runtime", () => {
		const arktypeSchema = getArkTypeSchema();
		bench("arktype", () => {
			arktypeSchema(data);
		});

		const valibotSchema = getValibotSchema();
		bench("valibot", () => {
			v.safeParse(valibotSchema, data);
		});

		const zodSchema = getZodSchema();
		bench("zod", () => {
			zodSchema.safeParse(data);
		});
		bench("zod (jitless)", () => {
			zodSchema.safeParse(data, { jitless: true });
		});

		const zodMiniSchema = getZodMiniSchema();
		bench("zod-mini", () => {
			zodMiniSchema.safeParse(data);
		});
		bench("zod-mini (jitless)", () => {
			zodMiniSchema.safeParse(data, { jitless: true });
		});

		const effectSchema = getEffectSchema();
		bench("effect", () => {
			Schema.decodeUnknownEither(effectSchema)(data);
		});
	});

	describe("precompiled", () => {
		bench("typia", () => {
			typia.validate<TypiaSchema>(data);
		});
	});
});
