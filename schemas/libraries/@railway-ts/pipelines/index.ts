import {
  object,
  required,
  chain,
  string,
  number,
  date,
  array,
  nullable,
  union,
  stringEnum,
  minLength,
  maxLength,
  min,
  max,
  url,
  type Validator,
} from "@railway-ts/pipelines/schema";

import type { ProductData } from "#src";

export function getRailwayTsSchema() {
  const imageSchema = object({
    id: required(number()),
    created: required(date()),
    title: required(chain(string(), minLength(1), maxLength(100))),
    type: required(stringEnum(["jpg", "png"] as const)),
    size: required(number()),
    url: required(chain(string(), url())),
  });

  const ratingSchema = object({
    id: required(number()),
    stars: required(chain(number(), min(0), max(5))),
    title: required(chain(string(), minLength(1), maxLength(100))),
    text: required(chain(string(), minLength(1), maxLength(1000))),
    images: required(array(imageSchema)),
  });

  return object({
    id: required(number()),
    created: required(date()),
    title: required(chain(string(), minLength(1), maxLength(100))),
    brand: required(chain(string(), minLength(1), maxLength(30))),
    description: required(chain(string(), minLength(1), maxLength(500))),
    price: required(chain(number(), min(1), max(10000))),
    discount: union([chain(number(), min(1), max(100)), nullable()]),
    quantity: required(chain(number(), min(0), max(10))),
    tags: required(array(chain(string(), minLength(1), maxLength(30)))),
    images: required(array(imageSchema)),
    ratings: required(array(ratingSchema)),
  }) satisfies Validator<unknown, ProductData>;
}
