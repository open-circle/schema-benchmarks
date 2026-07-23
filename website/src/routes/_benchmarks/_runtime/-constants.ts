import { type DataType, dataTypeSchema } from "@schema-benchmarks/bench";
import type { StringFormat } from "@schema-benchmarks/schemas";
import {
  type ErrorType,
  errorTypeSchema,
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
