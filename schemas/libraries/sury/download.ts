import * as S from "sury";

import type { ProductData } from "#src";

const imageSchema = S.schema({
  id: S.number,
  created: S.date,
  title: S.string.with(S.maxLength, 100).with(S.minLength, 1),
  type: S.union(["jpg", "png"]),
  size: S.number,
  url: S.uri,
});
const ratingSchema = S.schema({
  id: S.number,
  stars: S.number.with(S.lte, 5).with(S.gte, 0),
  title: S.string.with(S.maxLength, 100).with(S.minLength, 1),
  text: S.string.with(S.maxLength, 1000).with(S.minLength, 1),
  images: S.array(imageSchema),
});
const productSchema = S.schema({
  id: S.number,
  created: S.date,
  title: S.string.with(S.maxLength, 100).with(S.minLength, 1),
  brand: S.string.with(S.maxLength, 30).with(S.minLength, 1),
  description: S.string.with(S.maxLength, 500).with(S.minLength, 1),
  price: S.number.with(S.lte, 10000).with(S.gte, 1),
  discount: S.union([S.number.with(S.lte, 100).with(S.gte, 1), null]),
  quantity: S.number.with(S.lte, 10).with(S.gte, 0),
  tags: S.array(S.string.with(S.maxLength, 30).with(S.minLength, 1)),
  images: S.array(imageSchema),
  ratings: S.array(ratingSchema),
}) satisfies S.Schema<ProductData>;

S.parser(productSchema)({});
