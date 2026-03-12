import { downloadResultsSchema, type MinifyType } from "@schema-benchmarks/bench";
import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";

import { upfetch } from "#/shared/lib/fetch";

export function getCompiledPath(fileName: string, minify: MinifyType) {
  return fileName
    .replace("download.ts", `download_compiled/${minify}.js`)
    .replace("download/index.ts", `download_compiled/${minify}.js`)
    .replace("download/", `download_compiled/`)
    .replace(".ts", `/${minify}.js`);
}

export const getDownloadResults = (signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["download"],
    queryFn: ({ signal }) =>
      upfetch("/download.json", {
        schema: downloadResultsSchema,
        signal: anyAbortSignal(signal, signalOpt),
      }),
  });
