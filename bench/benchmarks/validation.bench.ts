import { errorData, successData } from "@schema-benchmarks/data";
import * as Schema from "effect/Schema";
import Value from "typebox/value";
import typia from "typia";
import * as v from "valibot";
import { getAjv, getAjvSchema } from "../schemas/ajv";
import { getArkTypeSchema } from "../schemas/arktype";
import { getEffectSchema } from "../schemas/effect";
import { getTypeboxSchema } from "../schemas/typebox";
import type { TypiaSchema } from "../schemas/typia";
import { getValibotSchema } from "../schemas/valibot";
import { getYupSchema } from "../schemas/yup";
import { makeBenchFactory } from "../utils/bench-factory";

declare module "../utils/registry" {
	export interface MetaRegistry {
		validation: {
			bench: BaseBenchMeta & {
				dataType: "success" | "error";
			};
			case: BaseCaseMeta;
		};
	}
}

const bench = makeBenchFactory("validation");

for (const [dataType, data] of [
	["success", successData],
	["error", errorData],
] as const) {
	bench({ dataType, libraryType: "runtime" }, ({ library }) => {
		library("arktype", ({ add }) => {
			const arktypeSchema = getArkTypeSchema();
			add(() => {
				arktypeSchema.allows(data);
			});
		});

		library("valibot", ({ add }) => {
			const valibotSchema = getValibotSchema();
			add(() => {
				v.is(valibotSchema, data);
			});
		});

		library("effect", ({ add }) => {
			const effectSchema = getEffectSchema();
			add(() => {
				Schema.is(effectSchema)(data);
			});
		});

		library("typebox", ({ add }) => {
			const typeboxSchema = getTypeboxSchema();
			add(() => {
				try {
					Value.Check(typeboxSchema, data);
				} catch {}
			});
		});

		library("yup", ({ add }) => {
			const yupSchema = getYupSchema();
			add(() => {
				try {
					yupSchema.isValidSync(data);
				} catch {}
			});
		});

		library("ajv", ({ add }) => {
			const ajvSchema = getAjvSchema();
			const ajv = getAjv();
			add(
				() => {
					ajv.validate(ajvSchema, data);
				},
				{ note: "validate" },
			);

			const ajvValidate = ajv.compile(ajvSchema);
			add(
				() => {
					ajvValidate(data);
				},
				{ note: "compile" },
			);
		});
	});

	bench({ dataType, libraryType: "precompiled" }, ({ addLibrary }) => {
		addLibrary("typia", () => {
			typia.is<TypiaSchema>(data);
		});
	});
}
