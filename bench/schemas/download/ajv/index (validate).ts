import { Ajv, type JSONSchemaType } from "ajv";
import addFormats from "ajv-formats";
import addKeywords from "ajv-keywords";
import type { ImageData, ProductData, RatingData } from "../../../data";

const ajv = new Ajv();
addFormats(ajv, { formats: ["url"] });
addKeywords(ajv, ["instanceof"]);

const dateSchema: JSONSchemaType<Date> = {
  type: "object",
  instanceof: "Date",
  required: [],
};
const imageSchema: JSONSchemaType<ImageData> = {
  type: "object",
  properties: {
    id: { type: "number" },
    created: dateSchema,
    title: { type: "string", minLength: 1, maxLength: 100 },
    type: { type: "string", enum: ["jpg", "png"] },
    size: { type: "number" },
    url: { type: "string", format: "url" },
  },
  required: ["id", "created", "title", "type", "size", "url"],
};
const ratingSchema: JSONSchemaType<RatingData> = {
  type: "object",
  properties: {
    id: { type: "number" },
    stars: { type: "number", minimum: 0, maximum: 5 },
    title: { type: "string", minLength: 1, maxLength: 100 },
    text: { type: "string", minLength: 1, maxLength: 1000 },
    images: { type: "array", items: imageSchema },
  },
  required: ["id", "stars", "title", "text", "images"],
};
const productSchema: JSONSchemaType<ProductData> = {
  type: "object",
  properties: {
    id: { type: "number" },
    created: dateSchema,
    title: { type: "string", minLength: 1, maxLength: 100 },
    brand: { type: "string", minLength: 1, maxLength: 30 },
    description: { type: "string", minLength: 1, maxLength: 500 },
    price: { type: "number", minimum: 1, maximum: 10000 },
    discount: {
      type: "number",
      minimum: 1,
      maximum: 100,
      nullable: true,
    } as never,
    quantity: { type: "number", minimum: 0, maximum: 10 },
    tags: {
      type: "array",
      items: { type: "string", minLength: 1, maxLength: 30 },
    },
    images: { type: "array", items: imageSchema },
    ratings: { type: "array", items: ratingSchema },
  },
  required: [
    "id",
    "created",
    "title",
    "brand",
    "description",
    "price",
    "discount",
    "quantity",
    "tags",
    "images",
    "ratings",
  ],
};

ajv.validate(productSchema, {});
