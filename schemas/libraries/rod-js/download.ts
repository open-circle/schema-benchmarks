import { rod } from "rod-js";

await rod.init();

const imageSchema = rod.object({
  id: rod.number(),
  created: rod.date(),
  title: rod.string().min(1).max(100),
  type: rod.enum(["jpg", "png"]),
  size: rod.number(),
  url: rod.string().url(),
});

const ratingSchema = rod.object({
  id: rod.number(),
  stars: rod.number().min(0).max(5),
  title: rod.string().min(1).max(100),
  text: rod.string().min(1).max(1000),
  images: rod.array(imageSchema),
});

const productSchema = rod.object({
  id: rod.number(),
  created: rod.date(),
  title: rod.string().min(1).max(100),
  brand: rod.string().min(1).max(30),
  description: rod.string().min(1).max(500),
  price: rod.number().min(1).max(10000),
  discount: rod.union([rod.number().min(1).max(100), rod.literal(null)]),
  quantity: rod.number().min(0).max(10),
  tags: rod.array(rod.string().min(1).max(30)),
  images: rod.array(imageSchema),
  ratings: rod.array(ratingSchema),
});

productSchema.parse({});
