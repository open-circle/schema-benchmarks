import { withKeywords } from "@ata-project/keywords";
import { Validator } from "ata-validator";

import type { ProductData } from "#src";

// Written as the JSON Schema it is, like the ajv entry, rather than through
// ata's `t` builder: ata validates JSON Schema, and this is the object `t`
// produces for the same definition, key for key. Building it through the
// builder measured the builder rather than the validator.
export function getAtaValidatorSchema() {
  const dateSchema = { type: "object", properties: {}, instanceof: "Date" };

  const imageSchema = {
    type: "object",
    properties: {
      id: { type: "number" },
      created: dateSchema,
      title: { type: "string", minLength: 1, maxLength: 100 },
      type: { enum: ["jpg", "png"] },
      size: { type: "number" },
      url: { type: "string", format: "uri" },
    },
    required: ["id", "created", "title", "type", "size", "url"],
  };

  const ratingSchema = {
    type: "object",
    properties: {
      id: { type: "number" },
      stars: { type: "number", minimum: 1, maximum: 5 },
      title: { type: "string", minLength: 1, maxLength: 100 },
      text: { type: "string", minLength: 1, maxLength: 1000 },
      images: { type: "array", items: imageSchema },
    },
    required: ["id", "stars", "title", "text", "images"],
  };

  const productSchema = {
    type: "object",
    properties: {
      id: { type: "number" },
      created: dateSchema,
      title: { type: "string", minLength: 1, maxLength: 100 },
      brand: { type: "string", minLength: 1, maxLength: 30 },
      description: { type: "string", minLength: 1, maxLength: 500 },
      price: { type: "number", minimum: 1, maximum: 10000 },
      discount: { anyOf: [{ type: "number", minimum: 1, maximum: 100 }, { type: "null" }] },
      quantity: { type: "number", minimum: 0, maximum: 10 },
      tags: { type: "array", items: { type: "string", minLength: 1, maxLength: 30 } },
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

  return withKeywords(new Validator(productSchema)) as Validator<ProductData>;
}
