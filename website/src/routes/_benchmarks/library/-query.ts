import { anyAbortSignal, collator, promiseAllKeyed } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { getBenchResultsFn } from "#/routes/_benchmarks/_runtime/-query";
import { getDownloadResultsFn } from "#/routes/_benchmarks/download/-query";
import { getStackResultsFn } from "#/routes/_benchmarks/stack/-query";

export const getAllLibrariesFn = createServerFn().handler(async () => {
  const { signal } = getRequest();
  const allResults = await promiseAllKeyed({
    bench: getBenchResultsFn({ signal }),
    download: getDownloadResultsFn({ signal }),
    stack: getStackResultsFn({ signal }),
  });

  const allItems: Array<{ libraryName: string }> = [
    ...allResults.bench.initialization,
    ...Object.values(allResults.bench.validation).flat(),
    ...Object.values(allResults.bench.parsing).flat(),
    ...Object.values(allResults.bench.standard).flat(),
    ...Object.values(allResults.bench.string)
      .flatMap((formatResults) => Object.values(formatResults))
      .flat(),
    ...allResults.bench.codec,
    ...Object.values(allResults.download).flat(),
    ...allResults.stack,
  ];

  const libraryNames = new Set(allItems.map(({ libraryName }) => libraryName));

  return Array.from(libraryNames).sort(collator.compare);
});

export const getAllLibraries = (signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["libraries"],
    queryFn: ({ signal }) => getAllLibrariesFn({ signal: anyAbortSignal(signal, signalOpt) }),
  });
