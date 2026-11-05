import { t as CompiledSchema } from "./index-CalR2c7a.mjs";
import * as z from "zod";
export declare const compiledProductSchema: z.ZodObject<{
  id: z.ZodNumber;
  created: z.ZodDate;
  title: z.ZodString;
  brand: z.ZodString;
  description: z.ZodString;
  price: z.ZodNumber;
  discount: z.ZodNullable<z.ZodNumber>;
  quantity: z.ZodNumber;
  tags: z.ZodArray<z.ZodString>;
  images: z.ZodArray<z.ZodObject<{
    id: z.ZodNumber;
    created: z.ZodDate;
    title: z.ZodString;
    type: z.ZodEnum<{
      jpg: "jpg";
      png: "png";
    }>;
    size: z.ZodNumber;
    url: z.ZodURL;
  }, z.core.$strip>>;
  ratings: z.ZodArray<z.ZodObject<{
    id: z.ZodNumber;
    stars: z.ZodNumber;
    title: z.ZodString;
    text: z.ZodString;
    images: z.ZodArray<z.ZodObject<{
      id: z.ZodNumber;
      created: z.ZodDate;
      title: z.ZodString;
      type: z.ZodEnum<{
        jpg: "jpg";
        png: "png";
      }>;
      size: z.ZodNumber;
      url: z.ZodURL;
    }, z.core.$strip>>;
  }, z.core.$strip>>;
}, z.core.$strip> & CompiledSchema<{
  id: number;
  created: Date;
  title: string;
  brand: string;
  description: string;
  price: number;
  discount: number | null;
  quantity: number;
  tags: string[];
  images: {
    id: number;
    created: Date;
    title: string;
    type: "jpg" | "png";
    size: number;
    url: string;
  }[];
  ratings: {
    id: number;
    stars: number;
    title: string;
    text: string;
    images: {
      id: number;
      created: Date;
      title: string;
      type: "jpg" | "png";
      size: number;
      url: string;
    }[];
  }[];
}>;
//# sourceMappingURL=index.d.mts.map