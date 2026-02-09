import vine from "@vinejs/vine";

const imageSchema = vine.object({
  id: vine.number(),
  created: vine.date(),
  title: vine.string().minLength(1).maxLength(100),
  type: vine.enum(["jpg", "png"]),
  size: vine.number(),
  url: vine.string().url(),
});
const ratingSchema = vine.object({
  id: vine.number(),
  stars: vine.number().min(0).max(5),
  title: vine.string().minLength(1).maxLength(100),
  text: vine.string().minLength(1).maxLength(1000),
  images: vine.array(imageSchema),
});

const productSchema = vine.object({
  id: vine.number(),
  created: vine.date(),
  title: vine.string().minLength(1).maxLength(100),
  brand: vine.string().minLength(1).maxLength(30),
  description: vine.string().minLength(1).maxLength(500),
  price: vine.number().min(1).max(10000),
  discount: vine.number().min(1).max(100).nullable(),
  quantity: vine.number().min(0).max(10),
  tags: vine.array(vine.string().minLength(1).maxLength(30)),
  images: vine.array(imageSchema),
  ratings: vine.array(ratingSchema),
});

vine.tryValidate({ schema: productSchema, data: {} });
