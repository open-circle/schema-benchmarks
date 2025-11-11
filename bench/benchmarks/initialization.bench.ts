import ts from "dedent";
import * as Schema from "effect/Schema";
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
			bench: unknown;
			case: unknown;
		};
	}
}

const bench = makeBenchFactory("initialization");

bench({ libraryType: "runtime" }, ({ addLibrary, library }) => {
	addLibrary(
		"arktype",
		() => {
			getArkTypeSchema();
		},
		{ snippet: ts`type(...)` },
	);

	addLibrary(
		"valibot",
		() => {
			getValibotSchema();
		},
		{ snippet: ts`v.object(...)` },
	);

	library("zod", ({ add }) => {
		add(
			() => {
				getZodSchema();
			},
			{ snippet: ts`z.object(...)` },
		);

		add(
			() => {
				getZodSchema();
			},
			{
				note: "jitless",
				snippet: ts`
					// z.config({ jitless: true });
					z.object(...)
				`,
			},
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

	library("zod/mini", ({ add }) => {
		add(
			() => {
				getZodMiniSchema();
			},
			{ snippet: ts`z.object(...)` },
		);

		add(
			() => {
				getZodMiniSchema();
			},
			{
				note: "jitless",
				snippet: ts`
					// z.config({ jitless: true });
					z.object(...)
				`,
			},
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
		add(
			() => {
				getEffectSchema();
			},
			{ snippet: ts`Schema.struct(...)` },
		);
		add(
			() => {
				Schema.decodeUnknownEither(getEffectSchema());
			},
			{
				note: "decodeUnknownEither",
				snippet: ts`Schema.decodeUnknownEither(Schema.struct(...))`,
			},
		);
	});

	addLibrary(
		"typebox",
		() => {
			getTypeboxSchema();
		},
		{ snippet: ts`Type.Object(...)` },
	);

	addLibrary(
		"yup",
		() => {
			getYupSchema();
		},
		{ snippet: ts`object(...)` },
	);

	addLibrary(
		"joi",
		() => {
			getJoiSchema();
		},
		{ snippet: ts`object(...)` },
	);

	library("ajv", ({ add }) => {
		const ajv = getAjv();
		add(
			() => {
				ajv.compile(getAjvSchema());
			},
			{ note: "compile", snippet: ts`ajv.compile({...})` },
		);
	});
});

bench({ libraryType: "precompiled" }, ({ addLibrary }) => {
	addLibrary(
		"typia",
		() => {
			typia.createValidate<TypiaSchema>();
		},
		{ snippet: ts`typia.createValidate<TypiaSchema>()` },
	);
});
