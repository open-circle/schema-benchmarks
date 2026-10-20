import { stackResultSchema } from "@schema-benchmarks/bench";
import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import * as v from "valibot";

import { upfetch } from "#src/shared/lib/fetch";
import { parseDefault } from "#src/shared/lib/import";

export const getStackResultsFn = createIsomorphicFn()
  .client(({ signal }: { signal: AbortSignal }) =>
    upfetch("/stack.json", { schema: v.array(stackResultSchema), signal }),
  )
  .server(() =>
    parseDefault(
      import("@schema-benchmarks/bench/stack.json", { with: { type: "json" } }),
      v.array(stackResultSchema),
    ),
  );

export const getStackResults = (signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["stack"],
    queryFn: ({ signal }) => getStackResultsFn({ signal: anyAbortSignal(signal, signalOpt) }),
  });
