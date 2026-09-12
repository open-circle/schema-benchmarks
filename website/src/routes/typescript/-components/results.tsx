import type { TypesResult } from "@schema-benchmarks/bench";
import { useMemo } from "react";

import type { SortableKey } from "#src/routes/typescript/-constants.ts";
import { EmptyState } from "#src/shared/components/empty-state";
import { MdSymbol } from "#src/shared/components/symbol";
import { Bar } from "#src/shared/components/table/bar.tsx";
import { useBreakpoints } from "#src/shared/hooks/use-breakpoints";
import type { SortDirection } from "#src/shared/lib/sort.ts";

import { TypesList } from "./list";
import { TypesTable } from "./table";

export interface TypesResultsProps {
  results: Array<TypesResult>;
  sortBy: SortableKey;
  sortDir: SortDirection;
}

export function TypesResults({ results, ...sortState }: TypesResultsProps) {
  const shouldUseTable = useBreakpoints(["laptop", "desktop"], true);
  const instantiationScaler = useMemo(
    () =>
      Bar.getScale(
        results.flatMap((result) => result.inference?.instantiations ?? []),
        { lowerBetter: true },
      ),
    [results],
  );
  const charsScaler = useMemo(
    () =>
      Bar.getScale(
        results.flatMap((result) => result.inference?.schema.chars ?? []),
        { lowerBetter: true },
      ),
    [results],
  );
  if (!results.length) {
    return (
      <EmptyState
        icon={<MdSymbol>database_off</MdSymbol>}
        title="No results found"
        subtitle="No libraries infer types from their schemas"
      />
    );
  }
  return (
    <div suppressHydrationWarning>
      {shouldUseTable ? (
        <div className="centred-table">
          <TypesTable {...{ results, instantiationScaler, charsScaler, ...sortState }} />
        </div>
      ) : (
        <TypesList {...{ results, instantiationScaler }} />
      )}
    </div>
  );
}
