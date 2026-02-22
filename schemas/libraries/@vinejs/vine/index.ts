import type { Satisfies } from "@schema-benchmarks/utils";
import vine from "@vinejs/vine";
import type { Infer } from "@vinejs/vine/types";

import type { ProductData } from "#src";

export function getVineSchema() {
  const imageSchema = vine.object({
    id: vine.number({ strict: true }),
    created: vine.date(),
    title: vine.string().minLength(1).maxLength(100),
    type: vine.enum(["jpg", "png"]),
    size: vine.number({ strict: true }),
    url: vine.string().url(),
  });
  const ratingSchema = vine.object({
    id: vine.number({ strict: true }),
    stars: vine.number({ strict: true }).min(0).max(5),
    title: vine.string().minLength(1).maxLength(100),
    text: vine.string().minLength(1).maxLength(1000),
    images: vine.array(imageSchema),
  });
  return vine.object({
    id: vine.number({ strict: true }),
    created: vine.date(),
    title: vine.string().minLength(1).maxLength(100),
    brand: vine.string().minLength(1).maxLength(30),
    description: vine.string().minLength(1).maxLength(500),
    price: vine.number({ strict: true }).min(1).max(10000),
    discount: vine.number({ strict: true }).min(1).max(100).nullable(),
    quantity: vine.number({ strict: true }).min(0).max(10),
    tags: vine.array(vine.string().minLength(1).maxLength(30)),
    images: vine.array(imageSchema),
    ratings: vine.array(ratingSchema),
  });
}

export type SatisfiesTest = Satisfies<Infer<ReturnType<typeof getVineSchema>>, ProductData>;
