import { uniqueBy } from "@schema-benchmarks/utils";
import type { UseSuspenseQueryResult } from "@tanstack/react-query";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

import { getAllWeeklyDownloads, getPackageName } from "./-query";

export function useDownloadsByPkgName(
  data: Array<{ libraryName: string; packageName?: string } | string>,
) {
  const pkgNames = useMemo(
    () =>
      uniqueBy(
        data.map((d) =>
          typeof d === "string"
            ? getPackageName(d)
            : (d.packageName ?? getPackageName(d.libraryName)),
        ),
      ),
    [data],
  );
  return useSuspenseQueries({
    queries: useMemo(() => pkgNames.map((pkgName) => getAllWeeklyDownloads(pkgName)), [pkgNames]),
    combine: useCallback(
      (results: Array<UseSuspenseQueryResult<number | "n/a">>): Record<string, number | "n/a"> =>
        Object.fromEntries(results.map((result, idx) => [pkgNames[idx], result.data])),
      [pkgNames],
    ),
  });
}

export function compareDownloadsByPkgName(
  downloadsByPkgName: Record<string, number | "n/a">,
  a: { libraryName: string; packageName?: string } | string,
  b: { libraryName: string; packageName?: string } | string,
) {
  const aPkgName =
    typeof a === "string" ? getPackageName(a) : (a.packageName ?? getPackageName(a.libraryName));
  const bPkgName =
    typeof b === "string" ? getPackageName(b) : (b.packageName ?? getPackageName(b.libraryName));
  const aDownloads = downloadsByPkgName[aPkgName];
  const bDownloads = downloadsByPkgName[bPkgName];
  if (typeof aDownloads === "number" && typeof bDownloads === "number") {
    return aDownloads - bDownloads;
  }
  if (typeof aDownloads === "number") return -1;
  if (typeof bDownloads === "number") return 1;
  return 0;
}
