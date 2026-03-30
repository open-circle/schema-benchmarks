import { withKeywords } from "@ata-project/keywords";
import type { JSONSchemaType } from "ajv";
import { Validator } from "ata-validator";

import type { ImageData, ProductData, RatingData } from "#src";

export function getAtaValidatorSchema() {
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
  return withKeywords(
    new Validator({
      type: "object",
      properties: {
        id: { type: "number" },
        created: dateSchema,
        title: { type: "string", minLength: 1, maxLength: 100 },
        brand: { type: "string", minLength: 1, maxLength: 30 },
        description: { type: "string", minLength: 1, maxLength: 500 },
        price: { type: "number", minimum: 1, maximum: 10000 },
        discount: {
          oneOf: [{ type: "number", minimum: 1, maximum: 100 }, { type: "null" }],
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
    } satisfies JSONSchemaType<ProductData>),
  );
}
