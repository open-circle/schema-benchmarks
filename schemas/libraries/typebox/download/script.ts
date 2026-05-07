import type { Satisfies } from "@schema-benchmarks/utils";
import * as Type from "typebox";
import * as Schema from "typebox/schema";

import type { ProductData } from "#src";

const Timestamp = Type.Refine(Type.Unsafe<Date>({}), (value) => value instanceof Date);

const { Product } = Type.Script(
  { Timestamp },
  `
    interface Image {
      id: number;
      created: Timestamp;
      title: Options<string, { minLength: 1, maxLength: 100 }>;
      type: "jpg" | "png";
      size: number;
      url: Options<string, { format: "url" }>;
    }
    interface Rating {
      id: number;
      stars: Options<number, { minimum: 1, maximum: 5 }>;
      title: Options<string, { minLength: 1, maxLength: 100 }>;
      text: Options<string, { minLength: 1, maxLength: 1000 }>;
      images: Array<Image>;
    }
    interface Product {
      id: number;
      created: Timestamp;
      title: Options<string, { minLength: 1, maxLength: 100 }>;
      brand: Options<string, { minLength: 1, maxLength: 30 }>;
      description: Options<string, { minLength: 1, maxLength: 500 }>;
      price: Options<number, { minimum: 1, maximum: 10000 }>;
      discount: Options<number | null, { minimum: 1, maximum: 100 }>;
      quantity: Options<number, { minimum: 1, maximum: 10 }>;
      tags: Array<Options<string, { minLength: 1, maxLength: 30 }>>;
      images: Array<Image>;
      ratings: Array<Rating>;
    }
    `,
);

export type SatisfiesTest = Satisfies<Type.Static<typeof Product>, ProductData>;

Schema.Parse(Product, {});
