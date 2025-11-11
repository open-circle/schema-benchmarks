import { errorData, successData } from "@schema-benchmarks/data";
import ts from "dedent";
import * as Schema from "effect/Schema";
import Value from "typebox/value";
import typia from "typia";
import * as v from "valibot";
import { getArkTypeSchema } from "../schemas/arktype";
import { getEffectSchema } from "../schemas/effect";
import { getJoiSchema } from "../schemas/joi";
import { getTypeboxSchema } from "../schemas/typebox";
import type { TypiaSchema } from "../schemas/typia";
import { getValibotSchema } from "../schemas/valibot";
import { getYupSchema } from "../schemas/yup";
import { getZodSchema } from "../schemas/zod";
import { getZodMiniSchema } from "../schemas/zod-mini";
import { makeBenchFactory } from "../utils/bench-factory";
import type { DataType, ErrorType } from "../utils/process";

declare module "../utils/registry" {
	export interface MetaRegistry {
		parse: {
			bench: {
				dataType: DataType;
				abortType: ErrorType;
			};
			case: unknown;
		};
	}
}

const bench = makeBenchFactory("parse");

for (const [dataType, data] of [
	["success", successData],
	["error", errorData],
] as const) {
	bench(
		{ dataType, libraryType: "runtime", abortType: "allErrors" },
		({ library }) => {
			library("arktype", ({ add }) => {
				const arktypeSchema = getArkTypeSchema();
				add(
					() => {
						arktypeSchema(data);
					},
					{
						snippet: ts`schema(data)`,
					},
				);
			});

			library("valibot", ({ add }) => {
				const valibotSchema = getValibotSchema();
				add(
					() => {
						v.safeParse(valibotSchema, data);
					},
					{
						snippet: ts`v.safeParse(schema, data)`,
					},
				);
			});

			library("zod", ({ add }) => {
				const zodSchema = getZodSchema();
				add(
					() => {
						zodSchema.safeParse(data);
					},
					{
						snippet: ts`schema.safeParse(data)`,
					},
				);

				add(
					() => {
						zodSchema.safeParse(data, { jitless: true });
					},
					{
						note: "jitless",
						snippet: ts`schema.safeParse(data, { jitless: true })`,
					},
				);
			});

			library("zod/mini", ({ add }) => {
				const zodMiniSchema = getZodMiniSchema();
				add(
					() => {
						zodMiniSchema.safeParse(data);
					},
					{
						snippet: ts`schema.safeParse(data)`,
					},
				);

				add(
					() => {
						zodMiniSchema.safeParse(data, { jitless: true });
					},
					{
						note: "jitless",
						snippet: ts`schema.safeParse(data, { jitless: true })`,
					},
				);
			});

			library("effect", ({ add }) => {
				const effectSchema = getEffectSchema();
				const decode = Schema.decodeUnknownEither(effectSchema, {
					errors: "all",
				});
				add(
					() => {
						decode(data);
					},
					{
						snippet: ts`
							const decode = Schema.decodeUnknownEither(schema, { errors: "all" });
							decode(data);
						`,
					},
				);
			});

			library("typebox", ({ add }) => {
				const typeboxSchema = getTypeboxSchema();
				add(
					() => {
						try {
							Value.Parse(typeboxSchema, data);
						} catch {}
					},
					{
						snippet: ts`Value.Parse(schema, data)`,
					},
				);
			});

			library("yup", ({ add }) => {
				const yupSchema = getYupSchema();
				add(
					() => {
						try {
							yupSchema.validateSync(data, { abortEarly: false });
						} catch {}
					},
					{
						snippet: ts`schema.validateSync(data, { abortEarly: false })`,
					},
				);
			});

			library("joi", ({ add }) => {
				const joiSchema = getJoiSchema();
				add(
					() => {
						joiSchema.validate(data, { abortEarly: false });
					},
					{
						snippet: ts`schema.validate(data, { abortEarly: false })`,
					},
				);
			});
		},
	);

	bench(
		{ dataType, libraryType: "runtime", abortType: "abortEarly" },
		({ library }) => {
			library("valibot", ({ add }) => {
				const valibotSchema = getValibotSchema();
				add(
					() => {
						v.safeParse(valibotSchema, data, { abortEarly: true });
					},
					{
						snippet: ts`v.safeParse(schema, data, { abortEarly: true })`,
					},
				);
				add(
					() => {
						v.safeParse(valibotSchema, data, { abortPipeEarly: true });
					},
					{
						note: "abortPipeEarly only",
						snippet: ts`v.safeParse(schema, data, { abortPipeEarly: true })`,
					},
				);
			});

			library("effect", ({ add }) => {
				const effectSchema = getEffectSchema();
				const decode = Schema.decodeUnknownEither(effectSchema, {
					errors: "first",
				});
				add(
					() => {
						decode(data);
					},
					{
						snippet: ts`
							const decode = Schema.decodeUnknownEither(schema, { errors: "first" });
							decode(data);
						`,
					},
				);
			});

			library("yup", ({ add }) => {
				const yupSchema = getYupSchema();
				add(
					() => {
						try {
							yupSchema.validateSync(data, { abortEarly: true });
						} catch {}
					},
					{
						snippet: ts`schema.validateSync(data, { abortEarly: true })`,
					},
				);
			});

			library("joi", ({ add }) => {
				const joiSchema = getJoiSchema();
				add(
					() => {
						joiSchema.validate(data, { abortEarly: true });
					},
					{
						snippet: ts`schema.validate(data, { abortEarly: true });`,
					},
				);
			});
		},
	);

	bench(
		{ dataType, libraryType: "precompiled", abortType: "unknown" },
		({ library }) => {
			library("typia", ({ add }) => {
				add(
					() => {
						typia.validate<TypiaSchema>(data);
					},
					{ note: "validate", snippet: ts`typia.validate<TypiaSchema>(data);` },
				);

				const typiaValidate = typia.createValidate<TypiaSchema>();
				add(
					() => {
						typiaValidate(data);
					},
					{
						note: "createValidate",
						snippet: ts`
							const validate = typia.createValidate<TypiaSchema>();
							validate(data);
						`,
					},
				);
			});
		},
	);
}
