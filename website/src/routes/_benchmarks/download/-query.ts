import type { MinifyType } from "@schema-benchmarks/bench";
import downloadResults from "@schema-benchmarks/bench/download.json" with { type: "json" };
import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

export function getCompiledPath(fileName: string, minify: MinifyType) {
  return fileName
    .replace("download.ts", `download_compiled/${minify}.js`)
    .replace("download/index.ts", `download_compiled/${minify}.js`)
    .replace("download/", `download_compiled/`)
    .replace(".ts", `/${minify}.js`);
}

export const getDownloadResultsFn = createServerFn().handler(() => downloadResults);

export const getDownloadResults = (signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["download"],
    queryFn: ({ signal }) =>
      getDownloadResultsFn({
        signal: anyAbortSignal(signal, signalOpt),
      }),
  });
