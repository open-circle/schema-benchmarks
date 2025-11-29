import {
  type BenchResults,
  benchResultsSchema,
  type DataType,
  dataTypeSchema,
} from "@schema-benchmarks/bench";
import benchResults from "@schema-benchmarks/bench/bench.json" with {
  type: "json",
};
import {
  type ErrorType,
  errorTypeSchema,
  type LibraryType,
  libraryTypeSchema,
} from "@schema-benchmarks/schemas";
import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import type { PageFilterChipsProps } from "@/components/page-filter/chips";

export const optionalDataTypeSchema = v.optional(dataTypeSchema, "valid");
export const dataTypeProps: Pick<
  PageFilterChipsProps<DataType>,
  "title" | "labels" | "options"
> = {
  title: "Data",
  options: optionalDataTypeSchema.wrapped.options,
  labels: {
    valid: { label: "Valid", icon: "check_circle" },
    invalid: { label: "Invalid", icon: "error" },
  },
};

export const optionalErrorTypeSchema = v.optional(errorTypeSchema, "allErrors");
export const errorTypeProps: Pick<
  PageFilterChipsProps<ErrorType>,
  "title" | "labels" | "options"
> = {
  title: "Abort early",
  options: optionalErrorTypeSchema.wrapped.options,
  labels: {
    allErrors: { label: "All errors", icon: "error" },
    abortEarly: { label: "Abort early", icon: "warning" },
  },
};

export const optionalLibraryTypeSchema = v.optional(
  libraryTypeSchema,
  "runtime",
);
export const libraryTypeProps: Pick<
  PageFilterChipsProps<LibraryType>,
  "title" | "labels" | "options"
> = {
  title: "Type",
  options: optionalLibraryTypeSchema.wrapped.options,
  labels: {
    runtime: { label: "Runtime", icon: "deployed_code" },
    precompiled: { label: "Precompiled", icon: "build" },
  },
};

export const getBenchResultsFn = createServerFn().handler(
  async ({ signal }) => {
    let results: BenchResults;
    if (process.env.NODE_ENV === "production") {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/open-circle/schema-benchmarks/refs/heads/main/bench/bench.json",
          { signal },
        );
        if (!response.ok)
          throw new Error("Failed to fetch results: ", {
            cause: response.status,
          });
        results = v.parse(benchResultsSchema, await response.json());
      } catch (error) {
        console.error("Falling back to local results: ", error);
        results = structuredClone(benchResults);
      }
    } else {
      results = structuredClone(benchResults);
    }

    return results;
  },
);

export const getBenchResults = (signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["bench"],
    queryFn: ({ signal }) =>
      getBenchResultsFn({
        signal: anyAbortSignal(signal, signalOpt),
      }),
  });
