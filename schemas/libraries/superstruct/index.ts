import {
  object,
  number,
  date,
  string,
  array,
  nullable,
  enums,
  refine,
  min,
  max,
  type Struct,
} from "superstruct";

import type { ProductData } from "#src";

function stringWithLength(min: number, max: number) {
  return refine(
    string(),
    `string with length between ${min} and ${max}`,
    (value) => value.length >= min && value.length <= max,
  );
}

export function getSuperstructSchema() {
  const urlSchema = refine(string(), "url", (value) => URL.canParse(value));

  const imageSchema = object({
    id: number(),
    created: date(),
    title: stringWithLength(1, 100),
    type: enums(["jpg", "png"]),
    size: number(),
    url: urlSchema,
  });

  const ratingSchema = object({
    id: number(),
    stars: max(min(number(), 0), 5),
    title: stringWithLength(1, 100),
    text: stringWithLength(1, 1000),
    images: array(imageSchema),
  });

  return object({
    id: number(),
    created: date(),
    title: stringWithLength(1, 100),
    brand: stringWithLength(1, 30),
    description: stringWithLength(1, 500),
    price: max(min(number(), 1), 10000),
    discount: nullable(max(min(number(), 1), 100)),
    quantity: max(min(number(), 0), 10),
    tags: array(stringWithLength(1, 30)),
    images: array(imageSchema),
    ratings: array(ratingSchema),
  }) satisfies Struct<ProductData>;
}
