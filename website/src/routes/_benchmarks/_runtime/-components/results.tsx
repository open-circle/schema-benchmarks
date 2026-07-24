import type { BenchResult } from "@schema-benchmarks/bench";
import type { DistributiveArray } from "@schema-benchmarks/utils";
import { useMemo } from "react";

import type { SortableKey } from "#src/routes/_benchmarks/_runtime/-constants";
import { EmptyState } from "#src/shared/components/empty-state";
import { MdSymbol } from "#src/shared/components/symbol";
import { Bar } from "#src/shared/components/table/bar";
import { useBreakpoints } from "#src/shared/hooks/use-breakpoints";
import type { SortDirection } from "#src/shared/lib/sort";

import { BenchCard } from "./card";
import { BenchTable } from "./table";

export type BenchTo = `/${"initialization" | "validation" | "parsing" | "standard" | "string"}`;

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
  if (!results.length) {
    return (
      <EmptyState
        icon={<MdSymbol>database_off</MdSymbol>}
        title="No results found"
        subtitle="Try a different combination of filters"
      />
    );
  }
  return (
    <div suppressHydrationWarning>
      {shouldUseTable ? (
        <BenchTable {...{ results, meanScaler }} {...props} />
      ) : (
        <ul className="bench-cards">
          {results.map((result) => (
            <BenchCard key={result.id} {...{ result, meanScaler: meanScaler }} />
          ))}
        </ul>
      )}
    </div>
  );
}
