import { benchResultsSchema } from "@schema-benchmarks/bench";
import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createIsomorphicFn } from "@tanstack/react-start";

import { upfetch } from "#src/shared/lib/fetch";

export const getBenchResultsFn = createIsomorphicFn()
  .client(({ signal }: { signal: AbortSignal }) =>
    upfetch("/bench.json", { schema: benchResultsSchema, signal }),
  )
  .server(() =>
    import("@schema-benchmarks/bench/bench.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  );

export const getBenchResults = (signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["bench"],
    queryFn: ({ signal }) => getBenchResultsFn({ signal: anyAbortSignal(signal, signalOpt) }),
  });
