import * as z from "zod";

import type { ProductData } from "#src";

export function getZodSchema() {
  const imageSchema = z.object({
    id: z.number(),
    created: z.date(),
    title: z.string().min(1).max(100),
    type: z.enum(["jpg", "png"]),
    size: z.number(),
    url: z.url(),
  });
  const ratingSchema = z.object({
    id: z.number(),
    stars: z.number().min(1).max(5),
    title: z.string().min(1).max(100),
    text: z.string().min(1).max(1000),
    images: z.array(imageSchema),
  });
  return z.toZod<ProductData>()(
    z.object({
      id: z.number(),
      created: z.date(),
      title: z.string().min(1).max(100),
      brand: z.string().min(1).max(30),
      description: z.string().min(1).max(500),
      price: z.number().min(1).max(10000),
      discount: z.number().min(1).max(100).nullable(),
      quantity: z.number().min(0).max(10),
      tags: z.array(z.string().min(1).max(30)),
      images: z.array(imageSchema),
      ratings: z.array(ratingSchema),
    }),
  );
}

export function getZodFactorySchema() {
  const imageSchema = z.object({
    id: z.number(),
    created: z.date(),
    title: z.string({ checks: [z.minLength(1), z.maxLength(100)] }),
    type: z.enum(["jpg", "png"]),
    size: z.number(),
    url: z.url(),
  });
  const ratingSchema = z.object({
    id: z.number(),
    stars: z.number({ checks: [z.gte(1), z.lte(5)] }),
    title: z.string({ checks: [z.minLength(1), z.maxLength(100)] }),
    text: z.string({ checks: [z.minLength(1), z.maxLength(1000)] }),
    images: z.array(imageSchema),
  });
  return z.toZod<ProductData>()(
    z.object({
      id: z.number(),
      created: z.date(),
      title: z.string({ checks: [z.minLength(1), z.maxLength(100)] }),
      brand: z.string({ checks: [z.minLength(1), z.maxLength(30)] }),
      description: z.string({ checks: [z.minLength(1), z.maxLength(500)] }),
      price: z.number({ checks: [z.gte(1), z.lte(10000)] }),
      discount: z.number({ checks: [z.gte(1), z.lte(100)] }).nullable(),
      quantity: z.number({ checks: [z.gte(0), z.lte(10)] }),
      tags: z.array(z.string({ checks: [z.minLength(1), z.maxLength(30)] })),
      images: z.array(imageSchema),
      ratings: z.array(ratingSchema),
    }),
  );
}
