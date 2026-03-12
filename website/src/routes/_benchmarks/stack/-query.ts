import { stackResultSchema } from "@schema-benchmarks/bench";
import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import * as v from "valibot";

import { upfetch } from "#/shared/lib/fetch";

const getStackResultsFn = createIsomorphicFn()
  .client(({ signal }: { signal: AbortSignal }) =>
    upfetch("/stack.json", { schema: v.array(stackResultSchema), signal }),
  )
  .server(() =>
    import("@schema-benchmarks/bench/stack.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  );

export const getStackResults = (signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["stack"],
    queryFn: ({ signal }) => getStackResultsFn({ signal: anyAbortSignal(signal, signalOpt) }),
  });
