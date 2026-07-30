import type { BaseBenchResult, RuntimeResult, JsonSchemaResult } from "@schema-benchmarks/bench";
import { collator, compareNumbers, compareStrings } from "@schema-benchmarks/utils";
import { useMemo } from "react";

import { compareDownloadsByPkgName, useDownloadsByPkgName } from "#src/routes/_benchmarks/-hooks";
import { applySort } from "#src/shared/lib/sort";
import type { SortDirection } from "#src/shared/lib/sort";

import type { SortableKey } from "./-constants";

export function getLibraryLabel({ libraryName, note }: BaseBenchResult) {
  return `${libraryName}${note ? ` (${note})` : ""}`;
}

export function useSortedResults<T extends RuntimeResult | JsonSchemaResult>(
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
              compareDownloadsByPkgName.fallback(downloadsByPkgName),
              compareStrings(getLibraryLabel),
              compareNumbers((result) => result.mean),
            ],
          },
        ),
      ),
    [results, sortBy, sortDir, downloadsByPkgName],
  );
}
