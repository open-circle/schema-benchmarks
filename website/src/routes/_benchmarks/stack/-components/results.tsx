import type { StackResult } from "@schema-benchmarks/bench";
import { useMemo } from "react";

import { Bar } from "#/shared/components/table/bar";
import { useBreakpoints } from "#/shared/hooks/use-breakpoints";
import { SortDirection } from "#/shared/lib/sort";

import { SortableKey } from "../-constants";
import { StackCard } from "./card";
import { StackTable } from "./table";

export interface StackResultsProps {
  results: Array<StackResult>;
  sortBy: SortableKey;
  sortDir: SortDirection;
}

export function StackResults({ results, ...props }: StackResultsProps) {
  const shouldUseTable = useBreakpoints(["laptop", "desktop"], true);
  const lineScale = useMemo(
    () =>
      Bar.getScale(
        results.filter((r) => typeof r.line === "number").map((r) => r.line),
        { lowerBetter: true },
      ),
    [results],
  );
  return (
    <div suppressHydrationWarning>
      {shouldUseTable ? (
        <StackTable {...{ results, lineScale }} {...props} />
      ) : (
        <div className="stack-cards">
          {results.map((result) => (
            <StackCard key={result.libraryName} {...{ result, lineScale }} />
          ))}
        </div>
      )}
    </div>
  );
}
