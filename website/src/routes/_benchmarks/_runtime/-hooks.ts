import type { BenchResult } from "@schema-benchmarks/bench";
import { collator } from "@schema-benchmarks/utils";
import { useMemo } from "react";

import { compareDownloadsByPkgName, useDownloadsByPkgName } from "#src/routes/_benchmarks/-hooks";
import { applySort } from "#src/shared/lib/sort";
import type { SortDirection } from "#src/shared/lib/sort";

import type { SortableKey } from "./-constants";

function getLibraryLabel({ libraryName, note }: BenchResult) {
  return `${libraryName}${note ? ` (${note})` : ""}`;
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
                return compareDownloadsByPkgName(downloadsByPkgName, a, b);
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
