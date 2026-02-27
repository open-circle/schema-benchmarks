import stackResults from "@schema-benchmarks/bench/stack.json" with { type: "json" };
import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

export const getStackResultsFn = createServerFn().handler(() => stackResults);

export const getStackResults = (signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["stack"],
    queryFn: ({ signal }) =>
      getStackResultsFn({
        signal: anyAbortSignal(signal, signalOpt),
      }),
  });
