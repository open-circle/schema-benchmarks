import typia from "typia";
import { bench, describe } from "vitest";
import z from "zod";
import * as zMini from "zod/mini";
import { getArkTypeSchema } from "./schemas/arktype";
import { getEffectSchema } from "./schemas/effect";
import { getTypeboxSchema } from "./schemas/typebox";
import type { TypiaSchema } from "./schemas/typia";
import { getValibotSchema } from "./schemas/valibot";
import { getZodSchema } from "./schemas/zod";
import { getZodMiniSchema } from "./schemas/zod-mini";

describe("runtime", () => {
	bench("arktype", () => {
		getArkTypeSchema();
	});

	bench("valibot", () => {
		getValibotSchema();
	});

	bench("zod", () => {
		getZodSchema();
	});

	z.config({ jitless: true });
	bench("zod (jitless)", () => {
		getZodSchema();
	});
	z.config({ jitless: false });

	bench("zod-mini", () => {
		getZodMiniSchema();
	});

	zMini.config({ jitless: true });
	bench("zod-mini (jitless)", () => {
		getZodMiniSchema();
	});
	zMini.config({ jitless: false });

	bench("effect", () => {
		getEffectSchema();
	});

	bench("typebox", () => {
		getTypeboxSchema();
	});
});

describe("precompiled", () => {
	bench("typia", () => {
		typia.createValidate<TypiaSchema>();
	});
});
