import {
  type JsonSchemaDirection,
  jsonSchemaDirectionSchema,
  type JsonSchemaSource,
  jsonSchemaSourceSchema,
  type StandardJsonSchemaSupport,
  standardJsonSchemaSupportSchema,
  type JsonSchemaTarget,
  jsonSchemaTargetSchema,
} from "@schema-benchmarks/schemas";
import * as v from "valibot";

import type { PageFilterChipsProps } from "#src/shared/components/page-filter/chips";

export const optionalJsonSchemaTargetSchema = v.optional(jsonSchemaTargetSchema, "draft-2020-12");

export const jsonSchemaTargetProps = {
  title: "Target",
  options: jsonSchemaTargetSchema.options,
  labels: {
    "draft-2020-12": { label: "Draft 2020-12", icon: "data_object" },
    "draft-07": { label: "Draft 07", icon: "data_object" },
    "openapi-3.0": { label: "OpenAPI 3.0", icon: "api" },
  },
} satisfies Pick<PageFilterChipsProps<JsonSchemaTarget>, "title" | "labels" | "options">;

export const optionalJsonSchemaDirectionSchema = v.optional(jsonSchemaDirectionSchema);

export const jsonSchemaDirectionProps = {
  title: "Type",
  options: jsonSchemaDirectionSchema.options,
  labels: {
    input: { label: "Input", icon: "login" },
    output: { label: "Output", icon: "logout" },
  },
} satisfies Pick<PageFilterChipsProps<JsonSchemaDirection>, "title" | "labels" | "options">;

/** Where the JSON schema comes from, which is why some libraries take no time at all. */
export const jsonSchemaSourceProps = {
  title: "Source",
  options: jsonSchemaSourceSchema.options,
  labels: {
    runtime: { label: "Runtime", icon: "sync" },
    precompiled: { label: "Precompiled", icon: "build" },
    "is-json-schema": { label: "Already JSON Schema", icon: "data_object" },
  },
} satisfies Pick<PageFilterChipsProps<JsonSchemaSource>, "title" | "labels" | "options">;

/** How the library supports the Standard JSON Schema interface. */
export const standardJsonSchemaProps = {
  title: "Standard JSON Schema",
  options: standardJsonSchemaSupportSchema.options,
  labels: {
    native: { label: "Native", icon: "verified" },
    "native-opt-in": { label: "Native Opt in", icon: "toggle_on" },
    "separate-package": { label: "Separate package", icon: "package_2" },
    none: { label: "None", icon: "block" },
  },
} satisfies Pick<PageFilterChipsProps<StandardJsonSchemaSupport>, "title" | "labels" | "options">;
