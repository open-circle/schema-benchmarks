import { Object, String, Number, Array, Literal, Union, InstanceOf } from "runtypes";

import type { ProductData } from "#src";

const StringWithLength = (min: number, max: number) =>
  String.withConstraint((s) => s.length >= min && s.length <= max);

const NumberInRange = (min: number, max: number) =>
  Number.withConstraint((n) => n >= min && n <= max);

export function getRuntypesSchema() {
  const Image = Object({
    id: Number,
    created: InstanceOf(Date),
    title: StringWithLength(1, 100),
    type: Union(Literal("jpg"), Literal("png")),
    size: Number,
    url: String.withConstraint((s) => URL.canParse(s)),
  });

  const Rating = Object({
    id: Number,
    stars: NumberInRange(0, 5),
    title: StringWithLength(1, 100),
    text: StringWithLength(1, 1000),
    images: Array(Image),
  });

  const schema = Object({
    id: Number,
    created: InstanceOf(Date),
    title: StringWithLength(1, 100),
    brand: StringWithLength(1, 30),
    description: StringWithLength(1, 500),
    price: NumberInRange(1, 10000),
    discount: NumberInRange(1, 100).nullable(),
    quantity: NumberInRange(0, 10),
    tags: Array(StringWithLength(1, 30)),
    images: Array(Image),
    ratings: Array(Rating),
  });

  // returning this has type portability issues
  schema.conform<ProductData>();

  return schema;
}
