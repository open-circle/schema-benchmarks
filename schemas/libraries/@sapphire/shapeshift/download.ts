import { s, BaseValidator } from "@sapphire/shapeshift";

import type { ProductData } from "#src";

const imageSchema = s.object({
  id: s.number(),
  created: s.date(),
  title: s.string().lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(100),
  type: s.enum(["jpg", "png"] as const),
  size: s.number(),
  url: s.string().url(),
});

const ratingSchema = s.object({
  id: s.number(),
  stars: s.number().greaterThanOrEqual(0).lessThanOrEqual(5),
  title: s.string().lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(100),
  text: s.string().lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(1000),
  images: s.array(imageSchema),
});

const productSchema = s.object({
  id: s.number(),
  created: s.date(),
  title: s.string().lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(100),
  brand: s.string().lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(30),
  description: s.string().lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(500),
  price: s.number().greaterThanOrEqual(1).lessThanOrEqual(10000),
  discount: s.number().greaterThanOrEqual(1).lessThanOrEqual(100).nullable(),
  quantity: s.number().greaterThanOrEqual(0).lessThanOrEqual(10),
  tags: s.array(s.string().lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(30)),
  images: s.array(imageSchema),
  ratings: s.array(ratingSchema),
}) satisfies BaseValidator<ProductData>;

productSchema.parse({});
