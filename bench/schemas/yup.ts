import type { ProductData } from "@schema-benchmarks/data";
import * as yup from "yup";

export function getYupSchema() {
	const imageSchema = yup.object({
		id: yup.number().required(),
		created: yup.date().required(),
		title: yup.string().min(1).max(100).required(),
		type: yup.string().oneOf(["jpg", "png"]).required(),
		size: yup.number().required(),
		url: yup.string().url().required(),
	});
	const ratingSchema = yup.object({
		id: yup.number().required(),
		stars: yup.number().min(0).max(5).required(),
		title: yup.string().min(1).max(100).required(),
		text: yup.string().min(1).max(1000).required(),
		images: yup.array(imageSchema).required(),
	});
	return yup.object({
		id: yup.number().required(),
		created: yup.date().required(),
		title: yup.string().min(1).max(100).required(),
		brand: yup.string().min(1).max(30).required(),
		description: yup.string().min(1).max(500).required(),
		price: yup.number().min(1).max(10000).required(),
		discount: yup.number().min(1).max(100).required().nullable(),
		quantity: yup.number().min(0).max(10).required(),
		tags: yup.array(yup.string().min(1).max(30).required()).required(),
		images: yup.array(imageSchema).required(),
		ratings: yup.array(ratingSchema).required(),
	}) satisfies yup.Schema<ProductData>;
}
