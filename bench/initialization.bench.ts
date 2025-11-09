import typia from "typia";
import { bench, describe } from "vitest";
import z from "zod";
import * as zMini from "zod/mini";
import { getArkTypeSchema } from "./schemas/arktype";
import { getEffectSchema } from "./schemas/effect";
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

	for (const jitless of [false, true]) {
		z.config({ jitless });
		bench(`zod${jitless ? " (jitless)" : ""}`, () => {
			getZodSchema();
		});
		z.config({ jitless: false });

		zMini.config({ jitless });
		bench(`zod-mini${jitless ? " (jitless)" : ""}`, () => {
			getZodMiniSchema();
		});
		zMini.config({ jitless: false });
	}

	bench("effect", () => {
		getEffectSchema();
	});
});

describe("precompiled", () => {
	bench("typia", () => {
		typia.createValidate<TypiaSchema>();
	});
});
