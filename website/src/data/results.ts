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
import type { OptionLabel } from "@/components/page-filter";

export const dataTypeSchema = v.picklist([
  "valid",
  "invalid",
]) satisfies v.GenericSchema<DataType>;
export const optionalDataTypeSchema = v.optional(dataTypeSchema, "valid");
export const dataTypeLabels: Record<DataType, OptionLabel> = {
  valid: { label: "Valid", icon: "check_circle" },
  invalid: { label: "Invalid", icon: "error" },
};

export const errorTypeSchema = v.picklist([
  "allErrors",
  "abortEarly",
]) satisfies v.GenericSchema<ErrorType>;
export const optionalErrorTypeSchema = v.optional(errorTypeSchema, "allErrors");
export const errorTypeLabels: Record<ErrorType, OptionLabel> = {
  allErrors: { label: "All Errors", icon: "error" },
  abortEarly: { label: "Abort Early", icon: "warning" },
};

export const libraryTypeSchema = v.picklist([
  "runtime",
  "precompiled",
]) satisfies v.GenericSchema<LibraryType>;
export const optionalLibraryTypeSchema = v.optional(
  libraryTypeSchema,
  "runtime",
);
export const libraryTypeLabels: Record<LibraryType, OptionLabel> = {
  runtime: { label: "Runtime", icon: "deployed_code" },
  precompiled: { label: "Precompiled", icon: "build" },
};

export const getResultsFn = createServerFn().handler(async ({ signal }) => {
  if (process.env.NODE_ENV === "production") {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/open-circle/schema-benchmarks/refs/heads/main/bench/results.json",
        { signal },
      );
      if (!response.ok)
        throw new Error("Failed to fetch results: ", {
          cause: response.status,
        });
      return (await response.json()) as ProcessedResults;
    } catch (error) {
      console.error("Falling back to local results: ", error);
    }
  }

  return results;
});

export const getResults = (signal?: AbortSignal) =>
  queryOptions({
    queryKey: ["results"],
    queryFn: () => getResultsFn({ signal }),
  });
