import * as Schema from "effect___beta/Schema";

import type { ProductData } from "#src";

const Image = Schema.Struct({
  id: Schema.Number,
  created: Schema.instanceOf(Date),
  title: Schema.String.check(Schema.isMinLength(1), Schema.isMaxLength(100)),
  type: Schema.Literals(["jpg", "png"]),
  size: Schema.Number,
  url: Schema.String.check(
    Schema.makeFilter((value) => {
      try {
        // oxlint-disable-next-line no-new
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }),
  ),
});

const Rating = Schema.Struct({
  id: Schema.Number,
  stars: Schema.Number.check(Schema.isGreaterThanOrEqualTo(0), Schema.isLessThanOrEqualTo(5)),
  title: Schema.String.check(Schema.isMinLength(1), Schema.isMaxLength(100)),
  text: Schema.String.check(Schema.isMinLength(1), Schema.isMaxLength(1000)),
  images: Schema.mutable(Schema.Array(Image)),
});

const Product = Schema.Struct({
  id: Schema.Number,
  created: Schema.instanceOf(Date),
  title: Schema.String.check(Schema.isMinLength(1), Schema.isMaxLength(100)),
  brand: Schema.String.check(Schema.isMinLength(1), Schema.isMaxLength(30)),
  description: Schema.String.check(Schema.isMinLength(1), Schema.isMaxLength(500)),
  price: Schema.Number.check(Schema.isGreaterThanOrEqualTo(1), Schema.isLessThanOrEqualTo(10000)),
  discount: Schema.NullOr(
    Schema.Number.check(Schema.isGreaterThanOrEqualTo(1), Schema.isLessThanOrEqualTo(100)),
  ),
  quantity: Schema.Number.check(Schema.isGreaterThanOrEqualTo(1), Schema.isLessThanOrEqualTo(10)),
  tags: Schema.mutable(
    Schema.Array(Schema.String.check(Schema.isMinLength(1), Schema.isMaxLength(30))),
  ),
  images: Schema.mutable(Schema.Array(Image)),
  ratings: Schema.mutable(Schema.Array(Rating)),
}) satisfies Schema.Schema<ProductData>;

Schema.decodeUnknownSync(Product)({});
