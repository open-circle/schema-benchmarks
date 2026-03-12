import { benchResultsSchema } from "@schema-benchmarks/bench";
import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";

import { upfetch } from "#/shared/lib/fetch";

export const getBenchResults = (signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["bench"],
    queryFn: ({ signal }) =>
      upfetch("/bench.json", {
        schema: benchResultsSchema,
        signal: anyAbortSignal(signal, signalOpt),
      }),
  });
