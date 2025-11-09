import { errorData, successData } from "@schema-benchmarks/data";
import typia from "typia";
import * as v from "valibot";
import { bench, describe } from "vitest";
import { getArkTypeSchema } from "./schemas/arktype";
import type { TypiaSchema } from "./schemas/typia";
import { getValibotSchema } from "./schemas/valibot";
import { getZodSchema } from "./schemas/zod";

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
		for (const jitless of [false, true]) {
			bench(`zod${jitless ? " (jitless)" : ""}`, () => {
				zodSchema.safeParse(data, { jitless });
			});
		}
	});

	describe("precompiled", () => {
		bench("typia", () => {
			typia.validate<TypiaSchema>(data);
		});
	});
});
