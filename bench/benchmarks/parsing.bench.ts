import { errorData, successData } from "@schema-benchmarks/data";
import * as Schema from "effect/Schema";
import Value from "typebox/value";
import typia from "typia";
import * as v from "valibot";
import z from "zod";
import * as zMini from "zod/mini";
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
				add(() => {
					arktypeSchema(data);
				});
			});

			library("valibot", ({ add }) => {
				const valibotSchema = getValibotSchema();
				add(() => {
					v.safeParse(valibotSchema, data);
				});
			});

			library("zod", ({ add }) => {
				const zodSchema = getZodSchema();
				add(() => {
					zodSchema.safeParse(data);
				});

				add(
					() => {
						zodSchema.safeParse(data);
					},
					{ note: "jitless" },
					{
						beforeAll() {
							z.config({ jitless: true });
						},
						afterAll() {
							z.config({ jitless: false });
						},
					},
				);
			});

			library("zod-mini", ({ add }) => {
				const zodMiniSchema = getZodMiniSchema();
				add(() => {
					zodMiniSchema.safeParse(data);
				});

				add(
					() => {
						zodMiniSchema.safeParse(data);
					},
					{ note: "jitless" },
					{
						beforeAll() {
							zMini.config({ jitless: true });
						},
						afterAll() {
							zMini.config({ jitless: false });
						},
					},
				);
			});

			library("effect", ({ add }) => {
				const effectSchema = getEffectSchema();
				add(() => {
					Schema.decodeUnknownEither(effectSchema, { errors: "all" })(data);
				});
			});

			library("typebox", ({ add }) => {
				const typeboxSchema = getTypeboxSchema();
				add(() => {
					try {
						Value.Parse(typeboxSchema, data);
					} catch {}
				});
			});

			library("yup", ({ add }) => {
				const yupSchema = getYupSchema();
				add(() => {
					try {
						yupSchema.validateSync(data, { abortEarly: false });
					} catch {}
				});
			});

			library("joi", ({ add }) => {
				const joiSchema = getJoiSchema();
				add(() => {
					joiSchema.validate(data, { abortEarly: false });
				});
			});
		},
	);

	bench(
		{ dataType, libraryType: "runtime", abortType: "abortEarly" },
		({ library }) => {
			library("valibot", ({ add }) => {
				const valibotSchema = getValibotSchema();
				add(() => {
					v.safeParse(valibotSchema, data, { abortEarly: true });
				});
				add(
					() => {
						v.safeParse(valibotSchema, data, { abortPipeEarly: true });
					},
					{ note: "abortPipeEarly only" },
				);
			});

			library("effect", ({ add }) => {
				const effectSchema = getEffectSchema();
				add(() => {
					Schema.decodeUnknownEither(effectSchema, { errors: "first" })(data);
				});
			});

			library("yup", ({ add }) => {
				const yupSchema = getYupSchema();
				add(() => {
					try {
						yupSchema.validateSync(data, { abortEarly: true });
					} catch {}
				});
			});

			library("joi", ({ add }) => {
				const joiSchema = getJoiSchema();
				add(() => {
					joiSchema.validate(data, { abortEarly: true });
				});
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
					{ note: "validate" },
				);

				const typiaValidate = typia.createValidate<TypiaSchema>();
				add(
					() => {
						typiaValidate(data);
					},
					{ note: "createValidate" },
				);
			});
		},
	);
}
