import type { StackResult } from "@schema-benchmarks/bench";
import { useMemo } from "react";

import { Bar } from "#/shared/components/table/bar";
import { useBreakpoints } from "#/shared/hooks/use-breakpoints";

import { StackCard } from "./card";

export interface StackResultsProps {
  results: Array<StackResult>;
}

export function StackResults({ results }: StackResultsProps) {
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
      {shouldUseTable ? null : (
        <div className="stack-cards">
          {results.map((result) => (
            <StackCard key={result.libraryName} {...{ result, lineScale }} />
          ))}
        </div>
      )}
    </div>
  );
}
