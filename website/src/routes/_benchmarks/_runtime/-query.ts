import benchResults from "@schema-benchmarks/bench/bench.json" with { type: "json" };
import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

export const getBenchResultsFn = createServerFn().handler(() => benchResults);

export const getBenchResults = (signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["bench"],
    queryFn: ({ signal }) =>
      getBenchResultsFn({
        signal: anyAbortSignal(signal, signalOpt),
      }),
  });
