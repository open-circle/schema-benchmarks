import { errorData, successData } from "@schema-benchmarks/data";
import typia from "typia";
import * as v from "valibot";
import { bench, describe } from "vitest";
import z from "zod";
import { getArkTypeSchema } from "./schemas/arktype";
import type { TypiaSchema } from "./schemas/typia";
import { getValibotSchema } from "./schemas/valibot";
import { getZodSchema } from "./schemas/zod";

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
		bench(`zod${jitless ? " (jitless)" : ""}`, () => {
			zodSchema.safeParse(data);
		});
	}
	z.config({ jitless: false });

	bench("typia", () => {
		typia.validate<TypiaSchema>(data);
	});
});
