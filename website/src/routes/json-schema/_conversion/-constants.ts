import {
  type JsonSchemaDirection,
  jsonSchemaDirectionSchema,
  type JsonSource,
  jsonSourceSchema,
  type JsonSchemaConversionTarget,
  jsonSchemaConversionTargetSchema,
} from "@schema-benchmarks/schemas";
import * as v from "valibot";

import type { PageFilterChipsProps } from "#src/shared/components/page-filter/chips";

export const optionalJsonSchemaConversionTargetSchema = v.optional(
  jsonSchemaConversionTargetSchema,
  "draft-2020-12",
);

export const jsonSchemaConversionTargetProps = {
  title: "Target",
  options: jsonSchemaConversionTargetSchema.options,
  labels: {
    "draft-2020-12": { label: "Draft 2020-12", icon: "data_object" },
    "draft-07": { label: "Draft 07", icon: "data_object" },
    "openapi-3.0": { label: "OpenAPI 3.0", icon: "api" },
  },
} satisfies Pick<PageFilterChipsProps<JsonSchemaConversionTarget>, "title" | "labels" | "options">;

export const optionalJsonSchemaDirectionSchema = v.optional(jsonSchemaDirectionSchema);

export const jsonSchemaDirectionProps = {
  title: "Type",
  options: jsonSchemaDirectionSchema.options,
  labels: {
    input: { label: "Input", icon: "login" },
    output: { label: "Output", icon: "logout" },
  },
} satisfies Pick<PageFilterChipsProps<JsonSchemaDirection>, "title" | "labels" | "options">;

/** How the library supports JSON schema */
export const jsonSourceProps = {
  title: "Standard JSON Schema",
  options: jsonSourceSchema.options,
  labels: {
    native: { label: "Native", icon: "verified" },
    "opt-in": { label: "Native Opt in", icon: "toggle_on" },
    package: { label: "Package", icon: "package_2" },
  },
} satisfies Pick<PageFilterChipsProps<JsonSource>, "title" | "labels" | "options">;
