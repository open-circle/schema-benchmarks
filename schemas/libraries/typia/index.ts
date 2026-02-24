import type { Satisfies } from "@schema-benchmarks/utils";
import type { tags } from "typia";

import type { ProductData } from "#src";

type ImageSchema = {
  id: number;
  created: Date;
  title: string & tags.MinLength<1> & tags.MaxLength<100>;
  type: "jpg" | "png";
  size: number;
  url: string & tags.Format<"url">;
};

type RatingSchema = {
  id: number;
  stars: number & tags.Minimum<1> & tags.Maximum<5>;
  title: string & tags.MinLength<1> & tags.MaxLength<100>;
  text: string & tags.MinLength<1> & tags.MaxLength<1000>;
  images: Array<ImageSchema>;
};

export type TypiaSchema = Satisfies<
  {
    id: number;
    created: Date;
    title: string & tags.MinLength<1> & tags.MaxLength<100>;
    brand: string & tags.MinLength<1> & tags.MaxLength<30>;
    description: string & tags.MinLength<1> & tags.MaxLength<500>;
    price: number & tags.Minimum<1> & tags.Maximum<10000>;
    discount: (number & tags.Minimum<1> & tags.Maximum<100>) | null;
    quantity: number & tags.Minimum<1> & tags.Maximum<10>;
    tags: Array<string> & tags.MinItems<1> & tags.MaxItems<30>;
    images: Array<ImageSchema>;
    ratings: Array<RatingSchema>;
  },
  ProductData
>;
