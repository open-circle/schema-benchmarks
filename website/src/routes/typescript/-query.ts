import { typesBenchResultsSchema } from "@schema-benchmarks/bench";
import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createIsomorphicFn } from "@tanstack/react-start";

import { upfetch } from "#src/shared/lib/fetch";

export const getTypesBenchResultsFn = createIsomorphicFn()
  .client(({ signal }: { signal: AbortSignal }) =>
    upfetch("/types.json", { schema: typesBenchResultsSchema, signal }),
  )
  .server(() =>
    import("@schema-benchmarks/bench/types.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  );

export const getTypesBenchResults = (signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["types"],
    queryFn: ({ signal }) => getTypesBenchResultsFn({ signal: anyAbortSignal(signal, signalOpt) }),
  });
