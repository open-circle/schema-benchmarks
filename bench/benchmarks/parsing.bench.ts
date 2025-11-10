import { errorData, successData } from "@schema-benchmarks/data";
import * as Schema from "effect/Schema";
import Value from "typebox/value";
import typia from "typia";
import * as v from "valibot";
import { bench, describe } from "vitest";
import { AbortType, DataType, LibraryType } from "../bench-types";
import { getArkTypeSchema } from "../schemas/arktype";
import { getEffectSchema } from "../schemas/effect";
import { getJoiSchema } from "../schemas/joi";
import { getTypeboxSchema } from "../schemas/typebox";
import type { TypiaSchema } from "../schemas/typia";
import { getValibotSchema } from "../schemas/valibot";
import { getYupSchema } from "../schemas/yup";
import { getZodSchema } from "../schemas/zod";
import { getZodMiniSchema } from "../schemas/zod-mini";

describe.each([
	[DataType.Success, successData],
	[DataType.Error, errorData],
])("%s", (type, data) => {
	describe(LibraryType.Runtime, () => {
		describe(AbortType.DoNot, () => {
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
				Schema.decodeUnknownEither(effectSchema, { errors: "all" })(data);
			});

			const typeboxSchema = getTypeboxSchema();
			bench("typebox", () => {
				try {
					Value.Parse(typeboxSchema, data);
				} catch {}
			});

			const yupSchema = getYupSchema();
			bench("yup", () => {
				try {
					yupSchema.validateSync(data, { abortEarly: false });
				} catch {}
			});

			const joiSchema = getJoiSchema();
			bench("joi", () => {
				joiSchema.validate(data, { abortEarly: false });
			});
		});

		describe.runIf(type === DataType.Error)(AbortType.Do, () => {
			const valibotSchema = getValibotSchema();
			bench("valibot", () => {
				v.safeParse(valibotSchema, data, { abortEarly: true });
			});

			// with valid data, this benchmark is identical to the above one
			bench("valibot (abortPipeEarly only)", () => {
				v.safeParse(valibotSchema, data, { abortPipeEarly: true });
			});

			const effectSchema = getEffectSchema();
			bench("effect", () => {
				Schema.decodeUnknownEither(effectSchema, { errors: "first" })(data);
			});

			const yupSchema = getYupSchema();
			bench("yup", () => {
				try {
					yupSchema.validateSync(data, { abortEarly: true });
				} catch {}
			});

			const joiSchema = getJoiSchema();
			bench("joi", () => {
				joiSchema.validate(data, { abortEarly: true });
			});
		});
	});

	describe(LibraryType.Precompiled, () => {
		describe(AbortType.DoNot, () => {
			bench("typia (validate)", () => {
				typia.validate<TypiaSchema>(data);
			});
			const typiaValidate = typia.createValidate<TypiaSchema>();
			bench("typia (createValidate)", () => {
				typiaValidate(data);
			});
		});
	});
});
