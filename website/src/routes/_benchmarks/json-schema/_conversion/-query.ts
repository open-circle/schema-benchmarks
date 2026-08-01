import { jsonSchemaBenchResultsSchema } from "@schema-benchmarks/bench";
import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createIsomorphicFn } from "@tanstack/react-start";

import { upfetch } from "#src/shared/lib/fetch";

export const getJsonSchemaBenchResultsFn = createIsomorphicFn()
  .client(({ signal }: { signal: AbortSignal }) =>
    upfetch("/json-schema.json", { schema: jsonSchemaBenchResultsSchema, signal }),
  )
  .server(() =>
    import("@schema-benchmarks/bench/json-schema.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  );

export const getJsonSchemaBenchResults = (signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["json-schema"],
    queryFn: ({ signal }) =>
      getJsonSchemaBenchResultsFn({ signal: anyAbortSignal(signal, signalOpt) }),
  });
