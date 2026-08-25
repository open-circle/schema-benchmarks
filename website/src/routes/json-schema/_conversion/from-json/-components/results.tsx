import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import type { SortableKey } from "#src/routes/_benchmarks/_runtime/-constants";
import { useSortedResults } from "#src/routes/_benchmarks/_runtime/-hooks";
import { getJsonSchemaBenchResults } from "#src/routes/json-schema/-query.ts";
import { EmptyState } from "#src/shared/components/empty-state";
import { MdSymbol } from "#src/shared/components/symbol";
import { Bar } from "#src/shared/components/table/bar";
import { useBreakpoints } from "#src/shared/hooks/use-breakpoints";
import type { SortDirection } from "#src/shared/lib/sort";

import { FromJsonList } from "./list";
import { FromJsonTable } from "./table";

export interface FromJsonResultsProps {
  sortBy: SortableKey;
  sortDir: SortDirection;
}

export function FromJsonResults({ sortBy, sortDir }: FromJsonResultsProps) {
  const { data } = useSuspenseQuery({
    ...getJsonSchemaBenchResults(),
    select: ({ conversion }) => conversion.fromJson,
  });
  const results = useSortedResults(data, sortBy, sortDir);
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
        subtitle="No libraries support JSON schema import"
      />
    );
  }
  return (
    <div suppressHydrationWarning>
      {shouldUseTable ? (
        <FromJsonTable {...{ results, meanScaler, sortBy, sortDir }} />
      ) : (
        <FromJsonList {...{ results, meanScaler }} />
      )}
    </div>
  );
}
