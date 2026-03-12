import { stackResultSchema } from "@schema-benchmarks/bench";
import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import * as v from "valibot";

import { upfetch } from "#/shared/lib/fetch";

export const getStackResults = (signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["stack"],
    queryFn: ({ signal }) =>
      upfetch("/stack.json", {
        schema: v.array(stackResultSchema),
        signal: anyAbortSignal(signal, signalOpt),
      }),
  });
