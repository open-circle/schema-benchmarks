import type { Decoder } from "decoders";
import {
  object,
  number,
  date,
  string,
  array,
  oneOf,
  nullable,
  sized,
  between,
  urlString,
} from "decoders";

import type { ProductData } from "#src";

export function getDecoderSchema() {
  const imageDecoder = object({
    id: number,
    created: date,
    title: sized(string, { min: 1, max: 100 }),
    type: oneOf(["jpg", "png"]),
    size: number,
    url: urlString,
  });
  const ratingDecoder = object({
    id: number,
    stars: between(1, 5),
    title: sized(string, { min: 1, max: 100 }),
    text: sized(string, { min: 1, max: 1000 }),
    images: array(imageDecoder),
  });
  return object({
    id: number,
    created: date,
    title: sized(string, { min: 1, max: 100 }),
    brand: sized(string, { min: 1, max: 30 }),
    description: sized(string, { min: 1, max: 500 }),
    price: between(1, 10000),
    discount: nullable(between(1, 100)),
    quantity: between(1, 10),
    tags: array(sized(string, { min: 1, max: 30 })),
    images: array(imageDecoder),
    ratings: array(ratingDecoder),
  }) satisfies Decoder<ProductData>;
}
