import * as Joi from "joi";
import type { ProductData } from "#src";

const imageSchema = Joi.object({
  id: Joi.number().required(),
  created: Joi.date().required(),
  title: Joi.string().min(1).max(100).required(),
  type: Joi.string().valid("jpg", "png").required(),
  size: Joi.number().required(),
  url: Joi.string().uri().required(),
});

const ratingSchema = Joi.object({
  id: Joi.number().required(),
  stars: Joi.number().min(0).max(5).required(),
  title: Joi.string().min(1).max(100).required(),
  text: Joi.string().min(1).max(1000).required(),
  images: Joi.array().items(imageSchema).required(),
});

const productSchema = Joi.object({
  id: Joi.number().required(),
  created: Joi.date().required(),
  title: Joi.string().min(1).max(100).required(),
  brand: Joi.string().min(1).max(30).required(),
  description: Joi.string().min(1).max(500).required(),
  price: Joi.number().min(1).max(10000).required(),
  discount: Joi.number().min(1).max(100).allow(null).required(),
  quantity: Joi.number().min(0).max(10).required(),
  tags: Joi.array().items(Joi.string().min(1).max(30)).required(),
  images: Joi.array().items(imageSchema).required(),
  ratings: Joi.array().items(ratingSchema).required(),
}) satisfies Joi.Schema<ProductData>;

productSchema.validate({});
