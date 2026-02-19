import * as t from "io-ts";
import * as td from "io-ts-types";

import type { ProductData } from "#src";

const ImageData = t.type({
  id: t.number,
  created: td.date,
  title: t.string,
  type: t.keyof({ jpg: null, png: null }),
  size: t.number,
  url: t.string,
});

const RatingData = t.type({
  id: t.number,
  stars: t.number,
  title: t.string,
  text: t.string,
  images: t.array(ImageData),
});

const productSchema = t.type(
  {
    id: t.number,
    created: td.date,
    title: t.string,
    brand: t.string,
    description: t.string,
    price: t.number,
    discount: t.union([t.number, t.null]),
    quantity: t.number,
    tags: t.array(t.string),
    images: t.array(ImageData),
    ratings: t.array(RatingData),
  },
  "ProductData",
) satisfies t.Type<ProductData>;

productSchema.decode({});
