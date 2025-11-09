import type { ProductData } from "@schema-benchmarks/data";
import * as z from "zod/mini";

export function getZodMiniSchema() {
	const imageSchema = z.object({
		id: z.number(),
		created: z.date(),
		title: z.string().check(z.minLength(1), z.maxLength(100)),
		type: z.enum(["jpg", "png"]),
		size: z.number(),
		url: z.url(),
	});
	const ratingSchema = z.object({
		id: z.number(),
		stars: z.number().check(z.minimum(0), z.maximum(5)),
		title: z.string().check(z.minLength(1), z.maxLength(100)),
		text: z.string().check(z.minLength(1), z.maxLength(1000)),
		images: z.array(imageSchema),
	});
	return z.object({
		id: z.number(),
		created: z.date(),
		title: z.string().check(z.minLength(1), z.maxLength(100)),
		brand: z.string().check(z.minLength(1), z.maxLength(30)),
		description: z.string().check(z.minLength(1), z.maxLength(500)),
		price: z.number().check(z.minimum(1), z.maximum(10000)),
		discount: z.nullable(z.number().check(z.minimum(1), z.maximum(100))),
		quantity: z.number().check(z.minimum(0), z.maximum(10)),
		tags: z.array(z.string().check(z.minLength(1), z.maxLength(30))),
		images: z.array(imageSchema),
		ratings: z.array(ratingSchema),
	}) satisfies z.ZodMiniType<ProductData>;
}
