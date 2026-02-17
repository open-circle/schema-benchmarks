import { uniqueBy } from "@schema-benchmarks/utils";
import { useSuspenseQueries, UseSuspenseQueryResult } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

import { getAllWeeklyDownloads, getPackageName } from "./-query";

export function useDownloadsByPkgName(data: Array<{ libraryName: string }>) {
  const pkgNames = useMemo(
    () =>
      uniqueBy(data, (d) => getPackageName(d.libraryName)).map((d) =>
        getPackageName(d.libraryName),
      ),
    [data],
  );
  return useSuspenseQueries({
    queries: useMemo(() => pkgNames.map((pkgName) => getAllWeeklyDownloads(pkgName)), [pkgNames]),
    combine: useCallback(
      (results: Array<UseSuspenseQueryResult<number>>) =>
        Object.fromEntries(results.map((result, idx) => [pkgNames[idx], result.data])),
      [pkgNames],
    ),
  });
}
