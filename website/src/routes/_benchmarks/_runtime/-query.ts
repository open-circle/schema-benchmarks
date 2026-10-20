import { benchResultsSchema } from "@schema-benchmarks/bench";
import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createIsomorphicFn } from "@tanstack/react-start";

import { upfetch } from "#src/shared/lib/fetch";
import { parseDefault } from "#src/shared/lib/import";

export const getBenchResultsFn = createIsomorphicFn()
  .client(({ signal }: { signal: AbortSignal }) =>
    upfetch("/bench.json", { schema: benchResultsSchema, signal }),
  )
  .server(() =>
    parseDefault(
      import("@schema-benchmarks/bench/bench.json", { with: { type: "json" } }),
      benchResultsSchema,
    ),
  );

export const getBenchResults = (signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["bench"],
    queryFn: ({ signal }) => getBenchResultsFn({ signal: anyAbortSignal(signal, signalOpt) }),
  });
