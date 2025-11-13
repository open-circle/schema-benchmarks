import {
  type DataType,
  dataTypeSchema,
  type ErrorType,
  errorTypeSchema,
  type LibraryType,
  libraryTypeSchema,
  type ProcessedResults,
  processedResultsSchema,
} from "@schema-benchmarks/bench";
import localResults from "@schema-benchmarks/bench/results.json";
import { getOrInsertComputed } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/";
import * as v from "valibot";
import type { OptionLabel } from "@/components/page-filter";

export const optionalDataTypeSchema = v.optional(dataTypeSchema, "valid");
export const dataTypeLabels: Record<DataType, OptionLabel> = {
  valid: { label: "Valid", icon: "check_circle" },
  invalid: { label: "Invalid", icon: "error" },
};

export const optionalErrorTypeSchema = v.optional(errorTypeSchema, "allErrors");
export const errorTypeLabels: Record<ErrorType, OptionLabel> = {
  allErrors: { label: "All Errors", icon: "error" },
  abortEarly: { label: "Abort Early", icon: "warning" },
};

export const optionalLibraryTypeSchema = v.optional(
  libraryTypeSchema,
  "runtime",
);
export const libraryTypeLabels: Record<LibraryType, OptionLabel> = {
  runtime: { label: "Runtime", icon: "deployed_code" },
  precompiled: { label: "Precompiled", icon: "build" },
};

const highlightCache = new Map<string, string>();
const highlight = (code: string) =>
  getOrInsertComputed(highlightCache, code, () =>
    // biome-ignore lint/style/noNonNullAssertion: we've checked that the language is loaded
    Prism.highlight(code, Prism.languages.typescript!, "typescript"),
  );

function highlightSnippets(results: ProcessedResults) {
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

export const getResultsFn = createServerFn().handler(async ({ signal }) => {
  if (!Prism.languages.typescript) {
    loadLanguages(["typescript"]);
  }

  let results: ProcessedResults;
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
      results = v.parse(processedResultsSchema, await response.json());
    } catch (error) {
      console.error("Falling back to local results: ", error);
      results = structuredClone(localResults);
    }
  } else {
    results = structuredClone(localResults);
  }

  highlightSnippets(results);

  return results;
});

export const getResults = (signal?: AbortSignal) =>
  queryOptions({
    queryKey: ["results"],
    queryFn: () => getResultsFn({ signal }),
  });
