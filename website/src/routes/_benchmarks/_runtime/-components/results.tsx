import type { BenchResult } from "@schema-benchmarks/bench";
import type { DistributiveArray } from "@schema-benchmarks/utils";
import { useMemo } from "react";

import { Bar } from "#/shared/components/table/bar";
import { useBreakpoints } from "#/shared/hooks/use-breakpoints";
import { SortDirection } from "#/shared/lib/sort";

import { SortableKey } from "../-constants";
import { BenchCard } from "./card";
import { BenchTable } from "./table";

export type BenchTo = `/${"initialization" | "validation" | "parsing"}`;

export interface BenchResultsProps {
  results: DistributiveArray<BenchResult>;
  to: BenchTo;
  sortBy: SortableKey;
  sortDir: SortDirection;
}

export function BenchResults({ results, ...props }: BenchResultsProps) {
  const shouldUseTable = useBreakpoints(["laptop", "desktop"], true);
  const meanScaler = useMemo(
    () =>
      Bar.getScale(
        results.map((result) => result.mean),
        { lowerBetter: true },
      ),
    [results],
  );
  return (
    <div suppressHydrationWarning>
      {shouldUseTable ? (
        <BenchTable {...{ results, meanScaler }} {...props} />
      ) : (
        <div className="bench-cards">
          {results.map((result) => (
            <BenchCard key={result.id} {...{ result, meanScaler: meanScaler }} />
          ))}
        </div>
      )}
    </div>
  );
}
