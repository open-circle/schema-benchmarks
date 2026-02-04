import * as S from "sury";
import type { ProductData } from "#src";

const imageSchema = S.schema({
  id: S.number,
  created: S.instance(Date),
  title: S.min(S.max(S.string, 100), 1),
  type: S.union(["jpg", "png"]),
  size: S.number,
  url: S.url(S.string),
});
const ratingSchema = S.schema({
  id: S.number,
  stars: S.min(S.max(S.number, 5), 0),
  title: S.min(S.max(S.string, 100), 1),
  text: S.min(S.max(S.string, 1000), 1),
  images: S.array(imageSchema),
});
const productSchema = S.schema({
  id: S.number,
  created: S.instance(Date),
  title: S.min(S.max(S.string, 100), 1),
  brand: S.min(S.max(S.string, 30), 1),
  description: S.min(S.max(S.string, 500), 1),
  price: S.min(S.max(S.number, 10000), 1),
  discount: S.union([S.min(S.max(S.number, 100), 1), null]),
  quantity: S.min(S.max(S.number, 10), 0),
  tags: S.array(S.min(S.max(S.string, 30), 1)),
  images: S.array(imageSchema),
  ratings: S.array(ratingSchema),
}) satisfies S.Schema<ProductData>;

const compile = S.compile(productSchema, "Any", "Output", "Sync");

compile({});
