import { downloadResultsSchema, type MinifyType } from "@schema-benchmarks/bench";
import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createIsomorphicFn } from "@tanstack/react-start";

import { upfetch } from "#/shared/lib/fetch";

export function getCompiledPath(fileName: string, minify: MinifyType) {
  return fileName
    .replace("download.ts", `download_compiled/${minify}.js`)
    .replace("download/index.ts", `download_compiled/${minify}.js`)
    .replace("download/", `download_compiled/`)
    .replace(".ts", `/${minify}.js`);
}

const getDownloadResultsFn = createIsomorphicFn()
  .client(({ signal }: { signal: AbortSignal }) =>
    upfetch("/download.json", { schema: downloadResultsSchema, signal }),
  )
  .server(() =>
    import("@schema-benchmarks/bench/download.json", { with: { type: "json" } }).then(
      (module) => module.default,
    ),
  );

export const getDownloadResults = (signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["download"],
    queryFn: ({ signal }) => getDownloadResultsFn({ signal: anyAbortSignal(signal, signalOpt) }),
  });
