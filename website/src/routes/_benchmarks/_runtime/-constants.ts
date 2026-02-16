import { type DataType, dataTypeSchema } from "@schema-benchmarks/bench";
import {
  type ErrorType,
  errorTypeSchema,
  type OptimizeType,
  optimizeTypeSchema,
} from "@schema-benchmarks/schemas";
import * as v from "valibot";
import type { PageFilterChipsProps } from "#/shared/components/page-filter/chips";

export const optionalDataTypeSchema = v.optional(dataTypeSchema, "invalid");

export const dataTypeProps: Pick<PageFilterChipsProps<DataType>, "title" | "labels" | "options"> = {
  title: "Data",
  options: dataTypeSchema.options,
  labels: {
    valid: { label: "Valid", icon: "check_circle" },
    invalid: { label: "Invalid", icon: "error" },
  },
};

export const optionalErrorTypeSchema = v.optional(errorTypeSchema);

export const errorTypeProps: Pick<
  PageFilterChipsProps<ErrorType>,
  "title" | "labels" | "options"
> = {
  title: "Abort early",
  options: errorTypeSchema.options,
  labels: {
    allErrors: { label: "All errors", icon: "error" },
    abortEarly: { label: "Abort early", icon: "warning" },
  },
};

export const optionalOptimizeTypeSchema = v.optional(optimizeTypeSchema);

export const optimizeTypeProps: Pick<
  PageFilterChipsProps<OptimizeType>,
  "title" | "labels" | "options"
> = {
  title: "Optimizations",
  options: optimizeTypeSchema.options,
  labels: {
    none: { label: "None", icon: "flash_off" },
    jit: { label: "JIT", icon: "code" },
    precompiled: { label: "Precompiled", icon: "build" },
  },
};
