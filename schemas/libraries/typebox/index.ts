import type { Satisfies } from "@schema-benchmarks/utils";
import { type StaticDecode, Type } from "typebox";

import type { ProductData } from "#src";

export function getTypeboxSchema() {
  const Timestamp = Type.Codec(Type.Number())
    .Decode((value): Date => new Date(value))
    .Encode((value) => value.getTime());
  const Image = Type.Object({
    id: Type.Number(),
    created: Timestamp,
    title: Type.String({ minLength: 1, maxLength: 100 }),
    type: Type.Enum(["jpg", "png"]),
    size: Type.Number(),
    url: Type.String({ format: "url" }),
  });
  const Rating = Type.Object({
    id: Type.Number(),
    stars: Type.Number({ minimum: 1, maximum: 5 }),
    title: Type.String({ minLength: 1, maxLength: 100 }),
    text: Type.String({ minLength: 1, maxLength: 1000 }),
    images: Type.Array(Image),
  });
  return Type.Object({
    id: Type.Number(),
    created: Timestamp,
    title: Type.String({ minLength: 1, maxLength: 100 }),
    brand: Type.String({ minLength: 1, maxLength: 30 }),
    description: Type.String({ minLength: 1, maxLength: 500 }),
    price: Type.Number({ minimum: 1, maximum: 10000 }),
    discount: Type.Union([Type.Number({ minimum: 1, maximum: 100 }), Type.Null()]),
    quantity: Type.Number({ minimum: 1, maximum: 10 }),
    tags: Type.Array(Type.String({ minLength: 1, maxLength: 30 })),
    images: Type.Array(Image),
    ratings: Type.Array(Rating),
  });
}

export type SatisfiesTest = Satisfies<
  StaticDecode<ReturnType<typeof getTypeboxSchema>>,
  ProductData
>;
