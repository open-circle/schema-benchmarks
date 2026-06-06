import type { Satisfies } from "@schema-benchmarks/utils";
import * as Type from "typebox";

import type { ProductData } from "#src";

export function getTypeboxSchema() {
  const Timestamp = Type.Refine(Type.Unsafe<Date>({}), (value) => value instanceof Date);
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
  Type.Static<ReturnType<typeof getTypeboxSchema>>,
  ProductData
>;

export function getTypeboxScriptSchema() {
  const Timestamp = Type.Refine(Type.Unsafe<Date>({}), (value) => value instanceof Date);
  return Type.Script(
    { Timestamp },
    `
    interface Image {
      id: number;
      created: Timestamp;
      title: string with { minLength: 1, maxLength: 100 };
      type: "jpg" | "png";
      size: number;
      url: string with { format: "url" };
    }
    interface Rating {
      id: number;
      stars: number with { minimum: 1, maximum: 5 };
      title: string with { minLength: 1, maxLength: 100 };
      text: string with { minLength: 1, maxLength: 1000 };
      images: Array<Image>;
    }
    interface Product {
      id: number;
      created: Timestamp;
      title: string with { minLength: 1, maxLength: 100 };
      brand: string with { minLength: 1, maxLength: 30 };
      description: string with { minLength: 1, maxLength: 500 };
      price: number with { minimum: 1, maximum: 10000 };
      discount: number | null with { minimum: 1, maximum: 100 };
      quantity: number with { minimum: 1, maximum: 10 };
      tags: Array<string with { minLength: 1, maxLength: 30 }>;
      images: Array<Image>;
      ratings: Array<Rating>;
    }
    `,
  ).Product;
}

export type SatisfiesScriptTest = Satisfies<
  Type.Static<ReturnType<typeof getTypeboxScriptSchema>>,
  ProductData
>;
