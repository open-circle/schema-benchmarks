import { errorData, successData } from "@schema-benchmarks/data";
import * as Schema from "effect/Schema";
import Value from "typebox/value";
import typia from "typia";
import * as v from "valibot";
import { bench, describe } from "vitest";
import { getAjv, getAjvSchema } from "./schemas/ajv";
import { getArkTypeSchema } from "./schemas/arktype";
import { getEffectSchema } from "./schemas/effect";
import { getTypeboxSchema } from "./schemas/typebox";
import type { TypiaSchema } from "./schemas/typia";
import { getValibotSchema } from "./schemas/valibot";
import { getYupSchema } from "./schemas/yup";

describe.each([
	["success", successData],
	["error", errorData],
])("%s", (_, data) => {
	describe("runtime", () => {
		const arktypeSchema = getArkTypeSchema();
		bench("arktype", () => {
			arktypeSchema.allows(data);
		});

		const valibotSchema = getValibotSchema();
		bench("valibot", () => {
			v.is(valibotSchema, data);
		});

		const effectSchema = getEffectSchema();
		bench("effect", () => {
			Schema.is(effectSchema)(data);
		});

		const typeboxSchema = getTypeboxSchema();
		bench("typebox", () => {
			try {
				Value.Check(typeboxSchema, data);
			} catch {}
		});

		const yupSchema = getYupSchema();
		bench("yup", () => {
			try {
				yupSchema.isValidSync(data);
			} catch {}
		});

		const ajvSchema = getAjvSchema();
		const ajv = getAjv();
		bench("ajv (validate)", () => {
			ajv.validate(ajvSchema, data);
		});
		const ajvValidate = ajv.compile(ajvSchema);
		bench("ajv (compile)", () => {
			ajvValidate(data);
		});
	});

	describe("precompiled", () => {
		bench("typia (is)", () => {
			typia.is<TypiaSchema>(data);
		});
		const typiaIs = typia.createIs<TypiaSchema>();
		bench("typia (createIs)", () => {
			typiaIs(data);
		});
	});
});
