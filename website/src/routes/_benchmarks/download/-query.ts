import {
  type DownloadResults,
  downloadResultsSchema,
  type MinifyType,
} from "@schema-benchmarks/bench";
import downloadResults from "@schema-benchmarks/bench/download.json" with {
  type: "json",
};
import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { upfetch } from "#/shared/lib/fetch";

export function getCompiledPath(fileName: string, minify: MinifyType) {
  return fileName
    .replace("download.ts", `download_compiled/${minify}.js`)
    .replace("download/index.ts", `download_compiled/${minify}.js`)
    .replace("download/", `download_compiled/`)
    .replace(".ts", `/${minify}.js`);
}

export const getDownloadResultsFn = createServerFn().handler(async () => {
  let results: DownloadResults | undefined;
  if (process.env.NODE_ENV === "production") {
    try {
      results = await upfetch(
        "https://raw.githubusercontent.com/open-circle/schema-benchmarks/refs/heads/main/bench/download.json",
        { signal: getRequest().signal, schema: downloadResultsSchema },
      );
    } catch (error) {
      console.error("Falling back to local results: ", error);
    }
  }

  return results ?? downloadResults;
});

export const getDownloadResults = (signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["download"],
    queryFn: ({ signal }) =>
      getDownloadResultsFn({
        signal: anyAbortSignal(signal, signalOpt),
      }),
  });
