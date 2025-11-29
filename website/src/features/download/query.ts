import {
  type DownloadResults,
  downloadResultsSchema,
  type MinifyType,
  minifyTypeSchema,
} from "@schema-benchmarks/bench";
import downloadResults from "@schema-benchmarks/bench/download.json" with {
  type: "json",
};
import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import type { PageFilterChipsProps } from "@/components/page-filter/chips";

export const optionalMinifyTypeSchema = v.optional(
  minifyTypeSchema,
  "minified",
);
export const minifyTypeProps: Pick<
  PageFilterChipsProps<MinifyType>,
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
        signal: anyAbortSignal(signal, signalOpt),
      }),
  });
