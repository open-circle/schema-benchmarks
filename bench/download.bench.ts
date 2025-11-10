import { bench } from "vitest";

bench("arktype", async () => {
	await import("./schemas/arktype.js");
});

bench("valibot", async () => {
	await import("./schemas/valibot.js");
});

bench("zod", async () => {
	await import("./schemas/zod.js");
});

bench("zod-mini", async () => {
	await import("./schemas/zod-mini.js");
});

bench("effect", async () => {
	await import("./schemas/effect.js");
});

bench("typebox", async () => {
	await import("./schemas/typebox.js");
});

bench.skip("typia (skipped, types only)", async () => {
	await import("./schemas/typia.js");
});
