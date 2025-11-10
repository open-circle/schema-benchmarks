import typia from "typia";
import z from "zod";
import * as zMini from "zod/mini";
import { getAjv, getAjvSchema } from "../schemas/ajv";
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

declare module "../utils/registry" {
	export interface MetaRegistry {
		initialization: {
			bench: BaseBenchMeta;
			case: BaseCaseMeta;
		};
	}
}

const bench = makeBenchFactory("initialization");

bench({ libraryType: "runtime" }, ({ addLibrary, library }) => {
	addLibrary("arktype", () => {
		getArkTypeSchema();
	});

	addLibrary("valibot", () => {
		getValibotSchema();
	});

	library("zod", ({ add }) => {
		add(() => {
			getZodSchema();
		});

		add(
			() => {
				getZodSchema();
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
		add(() => {
			getZodMiniSchema();
		});

		add(
			() => {
				getZodMiniSchema();
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

	addLibrary("effect", () => {
		getEffectSchema();
	});

	addLibrary("typebox", () => {
		getTypeboxSchema();
	});

	addLibrary("yup", () => {
		getYupSchema();
	});

	addLibrary("joi", () => {
		getJoiSchema();
	});

	library("ajv", ({ add }) => {
		const ajv = getAjv();
		add(
			() => {
				ajv.compile(getAjvSchema());
			},
			{ note: "compile" },
		);
	});
});

bench({ libraryType: "precompiled" }, ({ addLibrary }) => {
	addLibrary("typia", () => {
		typia.createValidate<TypiaSchema>();
	});
});
