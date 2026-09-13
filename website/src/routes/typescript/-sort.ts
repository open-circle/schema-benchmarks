import type { TypesResult } from "@schema-benchmarks/bench";
import { collator, compareStrings } from "@schema-benchmarks/utils";

import { compareDownloadsByPkgName } from "#src/routes/_benchmarks/-hooks";
import type { SortSearch } from "#src/shared/lib/sort";
import { applySort } from "#src/shared/lib/sort";

import type { SortableKey } from "./-constants.ts";

const compareInference = (
  a: TypesResult,
  b: TypesResult,
  read: (inference: NonNullable<TypesResult["inference"]>) => number,
) => (a.inference && b.inference ? read(a.inference) - read(b.inference) : 0);

export const compareResults = (
  { sortBy, sortDir }: SortSearch<SortableKey>,
  downloadsByPkgName: Record<string, number | "n/a">,
) => {
  const sort = applySort<TypesResult>(
    (a, b) => {
      switch (sortBy) {
        case "libraryName":
          return collator.compare(a.libraryName, b.libraryName);
        case "downloads":
          return compareDownloadsByPkgName(downloadsByPkgName, a, b);
        case "chars":
          return compareInference(a, b, (result) => result.schema.chars);
        default:
          return compareInference(a, b, (result) => result.instantiations);
      }
    },
    {
      sortDir,
      fallbacks: [
        compareDownloadsByPkgName.fallback(downloadsByPkgName),
        compareStrings((result) => result.libraryName),
      ],
    },
  );
  // A library that infers nothing has no number to compare, so it sorts last either way. This runs
  // outside the sort the direction is applied to: inside it, descending would bring it first.
  const byNumber = sortBy === "instantiations" || sortBy === "chars";
  return (a: TypesResult, b: TypesResult) =>
    (byNumber ? Number(!a.inference) - Number(!b.inference) : 0) || sort(a, b);
};
