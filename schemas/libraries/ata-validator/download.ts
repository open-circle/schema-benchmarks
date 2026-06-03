import { withKeywords } from "@ata-project/keywords";
import { Validator } from "ata-validator";
import { t } from "ata-validator/t";

const dateSchema = t.object({}, {
  instanceof: "Date",
} as never);

const imageSchema = t.object({
  id: t.number(),
  created: dateSchema,
  title: t.string({ minLength: 1, maxLength: 100 }),
  type: t.enum(["jpg", "png"]),
  size: t.number(),
  url: t.string({ format: "url" }),
});

const ratingSchema = t.object({
  id: t.number(),
  stars: t.number({ minimum: 0, maximum: 5 }),
  title: t.string({ minLength: 1, maxLength: 100 }),
  text: t.string({ minLength: 1, maxLength: 1000 }),
  images: t.array(imageSchema),
});

const productSchema = t.object({
  id: t.number(),
  created: dateSchema,
  title: t.string({ minLength: 1, maxLength: 100 }),
  brand: t.string({ minLength: 1, maxLength: 30 }),
  description: t.string({ minLength: 1, maxLength: 500 }),
  price: t.number({ minimum: 1, maximum: 10000 }),
  discount: t.union([t.number({ minimum: 1, maximum: 100 }), t.null()]),
  quantity: t.number({ minimum: 0, maximum: 10 }),
  tags: t.array(t.string({ minLength: 1, maxLength: 30 })),
  images: t.array(imageSchema),
  ratings: t.array(ratingSchema),
});

const productValidator = withKeywords(new Validator(productSchema));

productValidator.validate({});
