import type * as TF from "@mionjs/run-types/formats";
import type { Satisfies } from "@schema-benchmarks/utils";

import type { ProductData } from "#src";

type ImageSchema = {
  id: number;
  created: Date;
  title: TF.String<{ minLength: 1; maxLength: 100 }>;
  type: "jpg" | "png";
  size: number;
  url: TF.StringUrl;
};

type RatingSchema = {
  id: number;
  stars: TF.Number<{ min: 1; max: 5 }>;
  title: TF.String<{ minLength: 1; maxLength: 100 }>;
  text: TF.String<{ minLength: 1; maxLength: 1_000 }>;
  images: Array<ImageSchema>;
};

export type MionSchema = Satisfies<
  {
    id: number;
    created: Date;
    title: TF.String<{ minLength: 1; maxLength: 100 }>;
    brand: TF.String<{ minLength: 1; maxLength: 30 }>;
    description: TF.String<{ minLength: 1; maxLength: 500 }>;
    price: TF.Number<{ min: 1; max: 10_000 }>;
    discount: TF.Number<{ min: 1; max: 100 }> | null;
    quantity: TF.Number<{ min: 0; max: 10 }>;
    tags: Array<TF.String<{ minLength: 1; maxLength: 30 }>>;
    images: Array<ImageSchema>;
    ratings: Array<RatingSchema>;
  },
  ProductData
>;
