import * as S from "sury";

import type { ProductData } from "#src";

const imageSchema = S.schema({
  id: S.number,
  created: S.date,
  title: S.minLength(S.maxLength(S.string, 100), 1),
  type: S.union(["jpg", "png"]),
  size: S.number,
  url: S.uri,
});
const ratingSchema = S.schema({
  id: S.number,
  stars: S.gte(S.lte(S.number, 5), 0),
  title: S.minLength(S.maxLength(S.string, 100), 1),
  text: S.minLength(S.maxLength(S.string, 1000), 1),
  images: S.array(imageSchema),
});
const productSchema = S.schema({
  id: S.number,
  created: S.date,
  title: S.minLength(S.maxLength(S.string, 100), 1),
  brand: S.minLength(S.maxLength(S.string, 30), 1),
  description: S.minLength(S.maxLength(S.string, 500), 1),
  price: S.gte(S.lte(S.number, 10000), 1),
  discount: S.union([S.gte(S.lte(S.number, 100), 1), null]),
  quantity: S.gte(S.lte(S.number, 10), 0),
  tags: S.array(S.minLength(S.maxLength(S.string, 30), 1)),
  images: S.array(imageSchema),
  ratings: S.array(ratingSchema),
}) satisfies S.Schema<ProductData>;

S.parser(productSchema)({});
