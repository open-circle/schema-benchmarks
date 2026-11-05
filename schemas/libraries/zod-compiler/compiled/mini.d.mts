import { t as CompiledSchema } from "./index-CalR2c7a.mjs";
import * as z from "zod/mini";
export declare const compiledProductSchema: z.ZodMiniObject<{
  id: z.ZodMiniNumber<number>;
  created: z.ZodMiniDate<Date>;
  title: z.ZodMiniString<string>;
  brand: z.ZodMiniString<string>;
  description: z.ZodMiniString<string>;
  price: z.ZodMiniNumber<number>;
  discount: z.ZodMiniNullable<z.ZodMiniNumber<number>>;
  quantity: z.ZodMiniNumber<number>;
  tags: z.ZodMiniArray<z.ZodMiniString<string>>;
  images: z.ZodMiniArray<z.ZodMiniObject<{
    id: z.ZodMiniNumber<number>;
    created: z.ZodMiniDate<Date>;
    title: z.ZodMiniString<string>;
    type: z.ZodMiniEnum<{
      jpg: "jpg";
      png: "png";
    }>;
    size: z.ZodMiniNumber<number>;
    url: z.ZodMiniURL;
  }, z.core.$strip>>;
  ratings: z.ZodMiniArray<z.ZodMiniObject<{
    id: z.ZodMiniNumber<number>;
    stars: z.ZodMiniNumber<number>;
    title: z.ZodMiniString<string>;
    text: z.ZodMiniString<string>;
    images: z.ZodMiniArray<z.ZodMiniObject<{
      id: z.ZodMiniNumber<number>;
      created: z.ZodMiniDate<Date>;
      title: z.ZodMiniString<string>;
      type: z.ZodMiniEnum<{
        jpg: "jpg";
        png: "png";
      }>;
      size: z.ZodMiniNumber<number>;
      url: z.ZodMiniURL;
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
//# sourceMappingURL=mini.d.mts.map