import { typesBenchResultsSchema } from "@schema-benchmarks/bench";
import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createIsomorphicFn } from "@tanstack/react-start";

import { upfetch } from "#src/shared/lib/fetch";
import { parseDefault } from "#src/shared/lib/import";

export const getTypesBenchResultsFn = createIsomorphicFn()
  .client(({ signal }: { signal: AbortSignal }) =>
    upfetch("/types.json", { schema: typesBenchResultsSchema, signal }),
  )
  .server(() =>
    parseDefault(
      import("@schema-benchmarks/bench/types.json", { with: { type: "json" } }),
      typesBenchResultsSchema,
    ),
  );

export const getTypesBenchResults = (signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["types"],
    queryFn: ({ signal }) => getTypesBenchResultsFn({ signal: anyAbortSignal(signal, signalOpt) }),
  });
