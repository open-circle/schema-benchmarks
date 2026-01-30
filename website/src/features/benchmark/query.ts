import {
  type BenchResults,
  benchResultsSchema,
} from "@schema-benchmarks/bench";
import benchResults from "@schema-benchmarks/bench/bench.json" with {
  type: "json",
};
import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { upfetch } from "#/shared/lib/fetch";

export const getBenchResultsFn = createServerFn().handler(
  async ({ signal }) => {
    let results: BenchResults | undefined;
    if (process.env.NODE_ENV === "production") {
      try {
        results = await upfetch(
          "https://raw.githubusercontent.com/open-circle/schema-benchmarks/refs/heads/main/bench/bench.json",
          { signal, schema: benchResultsSchema },
        );
      } catch (error) {
        console.error("Falling back to local results: ", error);
      }
    }

    return results ?? benchResults;
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
