import type { Satisfies } from "@schema-benchmarks/utils";
import type { ProductData } from "#src";

type ImageSchema = {
  id: number;
  created: Date;
  /**
   * @minLength 1
   * @maxLength 100
   */
  title: string;
  type: "jpg" | "png";
  size: number;
  /**
   * @format url
   */
  url: string;
};

type RatingSchema = {
  id: number;
  /**
   * @minimum 1
   * @maximum 5
   */
  stars: number;
  /**
   * @minLength 1
   * @maxLength 100
   */
  title: string;
  /**
   * @minLength 1
   * @maxLength 1000
   */
  text: string;
  images: Array<ImageSchema>;
};

export type TypiaSchema = Satisfies<
  {
    id: number;
    created: Date;
    /**
     * @minLength 1
     * @maxLength 100
     */
    title: string;
    /**
     * @minLength 1
     * @maxLength 30
     */
    brand: string;
    /**
     * @minLength 1
     * @maxLength 500
     */
    description: string;
    /**
     * @minimum 1
     * @maximum 10000
     */
    price: number;
    /**
     * @minimum 1
     * @maximum 100
     */
    discount: number | null;
    /**
     * @minimum 1
     * @maximum 10
     */
    quantity: number;
    /**
     * @minItems 1
     * @maxItems 30
     */
    tags: Array<string>;
    images: Array<ImageSchema>;
    ratings: Array<RatingSchema>;
  },
  ProductData
>;
