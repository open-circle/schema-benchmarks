import type { StackResult } from "@schema-benchmarks/bench";
import { exclude, filterMap } from "@schema-benchmarks/utils";
import { useMemo } from "react";

import type { SortableKey } from "#src/routes/_benchmarks/stack/-constants";
import { Bar } from "#src/shared/components/table/bar";
import { useBreakpoints } from "#src/shared/hooks/use-breakpoints";
import type { SortDirection } from "#src/shared/lib/sort";

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
        <ul className="stack-cards">
          {results.map((result) => (
            <StackCard key={result.libraryName} {...{ result, frameScale, lineCountScale }} />
          ))}
        </ul>
      )}
    </div>
  );
}
