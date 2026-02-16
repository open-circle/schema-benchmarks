import type { BenchResult } from "@schema-benchmarks/bench";
import type { DistributiveArray } from "@schema-benchmarks/utils";
import { useMemo } from "react";

import { Bar } from "#/shared/components/table/bar";
import { useBreakpoints } from "#/shared/hooks/use-breakpoints";

import { BenchCard } from "./card";
import { BenchTable } from "./table";

export interface BenchResultsProps {
  results: DistributiveArray<BenchResult>;
}

export function BenchResults({ results }: BenchResultsProps) {
  const shouldUseTable = useBreakpoints(["laptop", "desktop"], true);
  const barScale = useMemo(
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
        <BenchTable results={results} />
      ) : (
        <div className="bench-cards">
          {results.map((result) => (
            <BenchCard key={result.id} {...{ result, barScale }} />
          ))}
        </div>
      )}
    </div>
  );
}
