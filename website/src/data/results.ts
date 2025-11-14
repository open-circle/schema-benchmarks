import {
  type BenchResults,
  benchResultsSchema,
  type DataType,
  type DownloadResults,
  dataTypeSchema,
  downloadResultsSchema,
  type ErrorType,
  errorTypeSchema,
  type LibraryType,
  libraryTypeSchema,
  type MinifyType,
  minifyTypeSchema,
} from "@schema-benchmarks/bench";
import benchResults from "@schema-benchmarks/bench/bench.json";
import downloadResults from "@schema-benchmarks/bench/download.json";
import { getOrInsertComputed } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/";
import * as v from "valibot";
import type { PageFilterGroupProps } from "@/components/page-filter";

export const optionalDataTypeSchema = v.optional(dataTypeSchema, "valid");
export const dataTypeProps: Pick<
  PageFilterGroupProps<DataType>,
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
  PageFilterGroupProps<ErrorType>,
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
  PageFilterGroupProps<LibraryType>,
  "title" | "labels" | "options"
> = {
  title: "Type",
  options: optionalLibraryTypeSchema.wrapped.options,
  labels: {
    runtime: { label: "Runtime", icon: "deployed_code" },
    precompiled: { label: "Precompiled", icon: "build" },
  },
};

const highlightCache = new Map<string, string>();
const highlight = (code: string) =>
  getOrInsertComputed(highlightCache, code, () =>
    // biome-ignore lint/style/noNonNullAssertion: we've checked that the language is loaded
    Prism.highlight(code, Prism.languages.typescript!, "typescript"),
  );

function highlightSnippets(results: BenchResults) {
  for (const libraryType of Object.values(results.initialization)) {
    for (const result of libraryType) {
      result.snippet = highlight(result.snippet);
    }
  }
  for (const libraryType of Object.values(results.validation)) {
    for (const dataType of Object.values(libraryType)) {
      for (const result of dataType) {
        result.snippet = highlight(result.snippet);
      }
    }
  }
  for (const libraryType of Object.values(results.parsing)) {
    for (const dataType of Object.values(libraryType)) {
      for (const errorType of Object.values(dataType)) {
        for (const result of errorType) {
          result.snippet = highlight(result.snippet);
        }
      }
    }
  }
}

export const getBenchResultsFn = createServerFn().handler(
  async ({ signal }) => {
    if (!Prism.languages.typescript) {
      loadLanguages(["typescript"]);
    }

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

    highlightSnippets(results);

    return results;
  },
);

export const getBenchResults = (signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["results"],
    queryFn: ({ signal }) =>
      getBenchResultsFn({
        signal: signalOpt ? AbortSignal.any([signal, signalOpt]) : signal,
      }),
  });

export const optionalMinifyTypeSchema = v.optional(
  minifyTypeSchema,
  "minified",
);
export const minifyTypeProps: Pick<
  PageFilterGroupProps<MinifyType>,
  "title" | "labels" | "options"
> = {
  title: "Minify",
  options: optionalMinifyTypeSchema.wrapped.options,
  labels: {
    minified: { label: "Minified", icon: "chips" },
    unminified: { label: "Unminified", icon: "code_blocks" },
  },
};

export const getDownloadResultsFn = createServerFn().handler(
  async ({ signal }) => {
    let results: DownloadResults;
    if (process.env.NODE_ENV === "production") {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/open-circle/schema-benchmarks/refs/heads/main/bench/download.json",
          { signal },
        );
        if (!response.ok)
          throw new Error("Failed to fetch results: ", {
            cause: response.status,
          });
        results = v.parse(downloadResultsSchema, await response.json());
      } catch (error) {
        console.error("Falling back to local results: ", error);
        results = structuredClone(downloadResults);
      }
    } else {
      results = structuredClone(downloadResults);
    }

    return results;
  },
);

export const getDownloadResults = (signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["download"],
    queryFn: ({ signal }) =>
      getDownloadResultsFn({
        signal: signalOpt ? AbortSignal.any([signal, signalOpt]) : signal,
      }),
  });

/**
 * Calculate the time to download a file at a given speed.
 * @param bytes - Size in bytes
 * @param mbps - Speed in megabits per second
 * @returns Time in milliseconds
 */
export const getDownloadTime = (bytes: number, mbps: number) =>
  (bytes * 8) / (mbps * 1000);
