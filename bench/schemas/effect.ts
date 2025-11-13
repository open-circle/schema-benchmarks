import * as Schema from "effect/Schema";
import type { ProductData } from "../data";

export function getEffectSchema() {
  const Image = Schema.Struct({
    id: Schema.Number,
    created: Schema.instanceOf(Date),
    title: Schema.String.pipe(Schema.minLength(1), Schema.maxLength(100)),
    type: Schema.Literal("jpg", "png"),
    size: Schema.Number,
    url: Schema.String.pipe(
      Schema.filter((value) => {
        try {
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
    stars: Schema.Number.pipe(
      Schema.greaterThanOrEqualTo(0),
      Schema.lessThanOrEqualTo(5),
    ),
    title: Schema.String.pipe(Schema.minLength(1), Schema.maxLength(100)),
    text: Schema.String.pipe(Schema.minLength(1), Schema.maxLength(1000)),
    images: Schema.mutable(Schema.Array(Image)),
  });
  return Schema.Struct({
    id: Schema.Number,
    created: Schema.instanceOf(Date),
    title: Schema.String.pipe(Schema.minLength(1), Schema.maxLength(100)),
    brand: Schema.String.pipe(Schema.minLength(1), Schema.maxLength(30)),
    description: Schema.String.pipe(Schema.minLength(1), Schema.maxLength(500)),
    price: Schema.Number.pipe(
      Schema.greaterThanOrEqualTo(1),
      Schema.lessThanOrEqualTo(10000),
    ),
    discount: Schema.NullOr(
      Schema.Number.pipe(
        Schema.greaterThanOrEqualTo(1),
        Schema.lessThanOrEqualTo(100),
      ),
    ),
    quantity: Schema.Number.pipe(
      Schema.greaterThanOrEqualTo(1),
      Schema.lessThanOrEqualTo(10),
    ),
    tags: Schema.mutable(
      Schema.Array(
        Schema.String.pipe(Schema.minLength(1), Schema.maxLength(30)),
      ),
    ),
    images: Schema.mutable(Schema.Array(Image)),
    ratings: Schema.mutable(Schema.Array(Rating)),
  }) satisfies Schema.Schema<ProductData>;
}
