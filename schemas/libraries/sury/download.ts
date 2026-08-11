import * as S from "sury";

import type { ProductData } from "#src";

const imageSchema = S.schema({
  id: S.number,
  created: S.date,
  title: S.string.with(S.nonEmpty).with(S.maxLength, 100),
  type: S.union(["jpg", "png"]),
  size: S.number,
  url: S.uri,
});
const ratingSchema = S.schema({
  id: S.number,
  stars: S.number.with(S.gte, 0).with(S.lte, 5),
  title: S.string.with(S.nonEmpty).with(S.maxLength, 100),
  text: S.string.with(S.nonEmpty).with(S.maxLength, 1000),
  images: S.array(imageSchema),
});
const productSchema = S.schema({
  id: S.number,
  created: S.date,
  title: S.string.with(S.nonEmpty).with(S.maxLength, 100),
  brand: S.string.with(S.nonEmpty).with(S.maxLength, 30),
  description: S.string.with(S.nonEmpty).with(S.maxLength, 500),
  price: S.number.with(S.gte, 1).with(S.lte, 10000),
  discount: S.number.with(S.gte, 1).with(S.lte, 100).with(S.nullable),
  quantity: S.number.with(S.gte, 0).with(S.lte, 10),
  tags: S.array(S.string.with(S.nonEmpty).with(S.maxLength, 30)),
  images: S.array(imageSchema),
  ratings: S.array(ratingSchema),
}) satisfies S.Schema<ProductData>;

S.parser(productSchema)({});
