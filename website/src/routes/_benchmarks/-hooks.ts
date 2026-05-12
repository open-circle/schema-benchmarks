import { uniqueBy } from "@schema-benchmarks/utils";
import { useSuspenseQueries, UseSuspenseQueryResult } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

import { getAllWeeklyDownloads, getPackageName } from "./-query";

export function useDownloadsByPkgName(data: Array<{ libraryName: string } | string>) {
  const pkgNames = useMemo(
    () => uniqueBy(data.map((d) => getPackageName(typeof d === "string" ? d : d.libraryName))),
    [data],
  );
  return useSuspenseQueries({
    queries: useMemo(() => pkgNames.map((pkgName) => getAllWeeklyDownloads(pkgName)), [pkgNames]),
    combine: useCallback(
      (results: Array<UseSuspenseQueryResult<number>>): Record<string, number> =>
        Object.fromEntries(results.map((result, idx) => [pkgNames[idx], result.data])),
      [pkgNames],
    ),
  });
}
