import * as t from "io-ts";
import * as td from "io-ts-types";

import type { ProductData } from "#src";

// Helper to create string with length constraints
const stringWithLength = (min: number, max: number) =>
  t.refinement(
    t.string,
    (s): s is string => s.length >= min && s.length <= max,
    `string with length between ${min} and ${max}`,
  );

// Helper to create number with range constraints
const numberInRange = (min: number, max: number) =>
  t.refinement(
    t.number,
    (n): n is number => n >= min && n <= max,
    `number between ${min} and ${max}`,
  );

// URL validation (basic)
const urlString = t.refinement(t.string, (s): s is string => URL.parse(s) !== null, "url");

export function getIotsSchema() {
  const ImageData = t.type({
    id: t.number,
    created: td.date,
    title: stringWithLength(1, 100),
    type: t.keyof({ jpg: null, png: null }),
    size: t.number,
    url: urlString,
  });
  const RatingData = t.type({
    id: t.number,
    stars: numberInRange(0, 5),
    title: stringWithLength(1, 100),
    text: stringWithLength(1, 1000),
    images: t.array(ImageData),
  });
  return t.type(
    {
      id: t.number,
      created: td.date,
      title: stringWithLength(1, 100),
      brand: stringWithLength(1, 30),
      description: stringWithLength(1, 500),
      price: numberInRange(1, 10000),
      discount: t.union([numberInRange(1, 100), t.null]),
      quantity: numberInRange(0, 10),
      tags: t.array(stringWithLength(1, 30)),
      images: t.array(ImageData),
      ratings: t.array(RatingData),
    },
    "ProductData",
  ) satisfies t.Type<ProductData>;
}
