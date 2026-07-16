import type { StackResult } from "@schema-benchmarks/bench";
import { exclude, filterMap } from "@schema-benchmarks/utils";
import { useMemo } from "react";

import { Bar } from "#/shared/components/table/bar";
import { useBreakpoints } from "#/shared/hooks/use-breakpoints";
import type { SortDirection } from "#/shared/lib/sort";

import type { SortableKey } from "../-constants";
import { StackCard } from "./card";
import { StackTable } from "./table";

export interface StackResultsProps {
  results: Array<StackResult>;
  sortBy: SortableKey;
  sortDir: SortDirection;
}

export function StackResults({ results, ...props }: StackResultsProps) {
  const shouldUseTable = useBreakpoints(["laptop", "desktop"], true);
  const frameScale = useMemo(
    () =>
      Bar.getScale(
        filterMap(results, (r) => (typeof r.frame === "number" ? r.frame : exclude)),
        { lowerBetter: true },
      ),
    [results],
  );
  const lineCountScale = useMemo(
    () =>
      Bar.getScale(
        results.map((r) => r.lineCount),
        { lowerBetter: true },
      ),
    [results],
  );
  return (
    <div suppressHydrationWarning>
      {shouldUseTable ? (
        <StackTable {...{ results, frameScale, lineCountScale }} {...props} />
      ) : (
        <div className="stack-cards">
          {results.map((result) => (
            <StackCard key={result.libraryName} {...{ result, frameScale, lineCountScale }} />
          ))}
        </div>
      )}
    </div>
  );
}
