import type { BenchResult } from "@schema-benchmarks/bench";
import { collator } from "@schema-benchmarks/utils";
import { useMemo } from "react";

import { applySort } from "#/shared/lib/sort";
import type { SortDirection } from "#/shared/lib/sort";

import { useDownloadsByPkgName } from "../-hooks";
import { formatLibraryName } from "../-lib";
import { getPackageName } from "../-query";
import type { SortableKey } from "./-constants";

function getLibraryLabel({ libraryName, note }: BenchResult) {
  return `${formatLibraryName(libraryName)}${note ? ` (${note})` : ""}`;
}

export function useSortedResults<T extends BenchResult>(
  results: Array<T>,
  sortBy: SortableKey,
  sortDir: SortDirection,
) {
  const downloadsByPkgName = useDownloadsByPkgName(results);
  return useMemo(
    () =>
      results.toSorted(
        applySort(
          (a, b) => {
            switch (sortBy) {
              case "downloads":
                return (
                  downloadsByPkgName[getPackageName(a.libraryName)] -
                  downloadsByPkgName[getPackageName(b.libraryName)]
                );
              case "libraryName":
                return collator.compare(getLibraryLabel(a), getLibraryLabel(b));
              default:
                return a[sortBy] - b[sortBy];
            }
          },
          {
            sortDir,
            fallbacks: [
              (a, b) => collator.compare(getLibraryLabel(a), getLibraryLabel(b)),
              (a, b) => a.mean - b.mean,
            ],
          },
        ),
      ),
    [results, sortBy, sortDir, downloadsByPkgName],
  );
}
