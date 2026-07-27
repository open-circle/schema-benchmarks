import { type DataType, dataTypeSchema } from "@schema-benchmarks/bench";
import type { StringFormat } from "@schema-benchmarks/schemas";
import {
  type ErrorType,
  errorTypeSchema,
  type JsonSchemaDirection,
  jsonSchemaDirectionSchema,
  type JsonSchemaSource,
  jsonSchemaSourceSchema,
  type StandardJsonSchemaSupport,
  standardJsonSchemaSupportSchema,
  type JsonSchemaTarget,
  jsonSchemaTargetSchema,
  type OptimizeType,
  optimizeTypeSchema,
  stringFormatSchema,
} from "@schema-benchmarks/schemas";
import * as v from "valibot";

import type { PageFilterChipsProps } from "#src/shared/components/page-filter/chips";
import { sortParams } from "#src/shared/lib/sort";

export const optionalDataTypeSchema = v.optional(dataTypeSchema, "invalid");

export const dataTypeProps = {
  title: "Data",
  options: dataTypeSchema.options,
  labels: {
    valid: { label: "Valid", icon: "check_circle" },
    invalid: { label: "Invalid", icon: "error" },
  },
} satisfies Pick<PageFilterChipsProps<DataType>, "title" | "labels" | "options">;

export const optionalErrorTypeSchema = v.optional(errorTypeSchema);

export const errorTypeProps = {
  title: "Abort early",
  options: errorTypeSchema.options,
  labels: {
    allErrors: { label: "All errors", icon: "error" },
    abortEarly: { label: "Abort early", icon: "warning" },
  },
} satisfies Pick<PageFilterChipsProps<ErrorType>, "title" | "labels" | "options">;

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

export const optionalOptimizeTypeSchema = v.optional(optimizeTypeSchema);

export const optimizeTypeProps = {
  title: "Optimizations",
  options: optimizeTypeSchema.options,
  labels: {
    none: { label: "None", icon: "flash_off" },
    jit: { label: "JIT", icon: "code" },
    precompiled: { label: "Precompiled", icon: "build" },
  },
} satisfies Pick<PageFilterChipsProps<OptimizeType>, "title" | "labels" | "options">;

export const optionalStringFormatSchema = v.optional(stringFormatSchema, "email");
export const stringFormatProps = {
  title: "Format",
  options: stringFormatSchema.options,
  labels: {
    "date-time": { label: "Datetime", icon: "calendar_clock" },
    date: { label: "Date", icon: "calendar_today" },
    time: { label: "Time", icon: "schedule" },
    duration: { label: "Duration", icon: "date_range" },
    email: { label: "Email", icon: "email" },
    url: { label: "URL", icon: "link" },
    uuid: { label: "UUID", icon: "fingerprint" },
    ipv4: { label: "IPv4", icon: "wifi" },
    ipv6: { label: "IPv6", icon: "wifi" },
  },
} satisfies Pick<PageFilterChipsProps<StringFormat>, "title" | "labels" | "options">;

export const sortableKeys = ["libraryName", "downloads", "mean"] as const;
export type SortableKey = (typeof sortableKeys)[number];

export const sortParamsEntries = sortParams(v.optional(v.picklist(sortableKeys), "mean"));
