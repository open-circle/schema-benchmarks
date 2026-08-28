import {
  array,
  enum_,
  instanceof_,
  nullable,
  number,
  object,
  string,
  type Schema,
} from "@remix-run/data-schema";
import { max, maxLength, min, minLength, url } from "@remix-run/data-schema/checks";

import type { ProductData } from "#src";

export function getRemixSchema() {
  const imageSchema = object({
    id: number(),
    created: instanceof_(Date),
    title: string().pipe(minLength(1), maxLength(100)),
    type: enum_(["jpg", "png"]),
    size: number(),
    url: string().pipe(url()),
  });
  const ratingSchema = object({
    id: number(),
    stars: number().pipe(min(1), max(5)),
    title: string().pipe(minLength(1), maxLength(100)),
    text: string().pipe(minLength(1), maxLength(1000)),
    images: array(imageSchema),
  });
  return object({
    id: number(),
    created: instanceof_(Date),
    title: string().pipe(minLength(1), maxLength(100)),
    brand: string().pipe(minLength(1), maxLength(30)),
    description: string().pipe(minLength(1), maxLength(500)),
    price: number().pipe(min(1), max(10000)),
    discount: nullable(number().pipe(min(1), max(100))),
    quantity: number().pipe(min(0), max(10)),
    tags: array(string().pipe(minLength(1), maxLength(30))),
    images: array(imageSchema),
    ratings: array(ratingSchema),
  }) satisfies Schema<unknown, ProductData>;
}
