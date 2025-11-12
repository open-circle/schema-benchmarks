import type {
  DataType,
  ErrorType,
  LibraryType,
  ProcessedResults,
} from "@schema-benchmarks/bench";
import results from "@schema-benchmarks/bench/results.json";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";

export const dataTypeSchema = v.picklist([
  "success",
  "error",
]) satisfies v.GenericSchema<DataType>;
export const optionalDataTypeSchema = v.optional(dataTypeSchema, "success");
export const dataTypeLabels: Record<DataType, { label: string; icon: string }> =
  {
    success: { label: "Success", icon: "check_circle" },
    error: { label: "Error", icon: "error" },
  };

export const errorTypeSchema = v.picklist([
  "abortEarly",
  "allErrors",
  "unknown",
]) satisfies v.GenericSchema<ErrorType>;
export const optionalErrorTypeSchema = v.optional(errorTypeSchema, "allErrors");
export const errorTypeLabels: Record<
  ErrorType,
  { label: string; icon: string }
> = {
  abortEarly: { label: "Abort Early", icon: "warning" },
  allErrors: { label: "All Errors", icon: "error" },
  unknown: { label: "Unknown", icon: "question_mark" },
};

export const libraryTypeSchema = v.picklist([
  "runtime",
  "precompiled",
]) satisfies v.GenericSchema<LibraryType>;
export const optionalLibraryTypeSchema = v.optional(
  libraryTypeSchema,
  "runtime",
);
export const libraryTypeLabels: Record<
  LibraryType,
  { label: string; icon: string }
> = {
  runtime: { label: "Runtime", icon: "deployed_code" },
  precompiled: { label: "Precompiled", icon: "build" },
};

export const getResultsFn = createServerFn().handler(async ({ signal }) => {
  if (process.env.NODE_ENV === "production") {
    const response = await fetch(
      "https://raw.githubusercontent.com/open-circle/schema-benchmarks/refs/heads/main/bench/results.json",
      { signal },
    );
    return (await response.json()) as ProcessedResults;
  }

  return results;
});

export const getResults = (signal?: AbortSignal) =>
  queryOptions({
    queryKey: ["results"],
    queryFn: () => getResultsFn({ signal }),
  });
