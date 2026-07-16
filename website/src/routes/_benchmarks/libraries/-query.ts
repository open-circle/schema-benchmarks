import {
  anyAbortSignal,
  collator,
  getOrInsertComputed,
  promiseAllKeyed,
} from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { getPackageName } from "#/routes/_benchmarks/-query";
import { getBenchResultsFn } from "#/routes/_benchmarks/_runtime/-query";
import { getDownloadResultsFn } from "#/routes/_benchmarks/download/-query";
import { getStackResultsFn } from "#/routes/_benchmarks/stack/-query";

export const getAllPackagesFn = createServerFn().handler(async () => {
  const { signal } = getRequest();
  const allResults = await promiseAllKeyed({
    bench: getBenchResultsFn({ signal }),
    download: getDownloadResultsFn({ signal }),
    stack: getStackResultsFn({ signal }),
  });

  const allItems: Array<{ libraryName: string; version: string }> = [
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

  const packageVersions = new Map<string, Set<string>>();
  for (const { libraryName, version } of allItems)
    getOrInsertComputed(packageVersions, getPackageName(libraryName), () => new Set()).add(version);

  return Object.fromEntries(
    Array.from(
      packageVersions,
      // oxlint-disable-next-line unicorn/no-array-sort typescript/unbound-method
      ([key, versions]) => [key, Array.from(versions).sort(collator.compare)] as const,
      // oxlint-disable-next-line unicorn/no-array-sort
    ).sort(([a], [b]) => collator.compare(a, b)),
  );
});

export const getAllPackages = (signalOpt?: AbortSignal) =>
  queryOptions({
    queryKey: ["packages"],
    queryFn: ({ signal }) => getAllPackagesFn({ signal: anyAbortSignal(signal, signalOpt) }),
  });
