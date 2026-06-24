import * as p from "@paseri/paseri";

import type { ProductData } from "#src";

export function getPaseriSchema(): p.Schema<ProductData> {
  const imageSchema = p.object({
    id: p.number(),
    created: p.date(),
    title: p.string().min(1).max(100),
    type: p.enum("jpg", "png"),
    size: p.number(),
    url: p.string().url(),
  });
  const ratingSchema = p.object({
    id: p.number(),
    stars: p.number().gte(0).lte(5),
    title: p.string().min(1).max(100),
    text: p.string().min(1).max(1000),
    images: p.array(imageSchema),
  });
  return p.object({
    id: p.number(),
    created: p.date(),
    title: p.string().min(1).max(100),
    brand: p.string().min(1).max(30),
    description: p.string().min(1).max(500),
    price: p.number().gte(1).lte(10000),
    discount: p.number().gte(1).lte(100).nullable(),
    quantity: p.number().gte(0).lte(10),
    tags: p.array(p.string().min(1).max(30)),
    images: p.array(imageSchema),
    ratings: p.array(ratingSchema),
  });
}
