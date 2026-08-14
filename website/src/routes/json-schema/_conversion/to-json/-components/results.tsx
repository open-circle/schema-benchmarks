import type { SchemaToJsonResult } from "@schema-benchmarks/bench";
import type { JsonSchemaDirection, JsonSchemaConversionTarget } from "@schema-benchmarks/schemas";
import { shallowFilter } from "@schema-benchmarks/utils";
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

import { ToJsonCard } from "./card";
import { ToJsonTable } from "./table";

export interface ToJsonResultsProps {
  target: JsonSchemaConversionTarget;
  direction?: JsonSchemaDirection;
  sortBy: SortableKey;
  sortDir: SortDirection;
}

export function ToJsonResults({ target, direction, sortBy, sortDir }: ToJsonResultsProps) {
  const { data } = useSuspenseQuery({
    ...getJsonSchemaBenchResults(),
    select: ({ conversion }) => conversion.toJson.filter(shallowFilter({ target, direction })),
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
        subtitle="Try a different combination of filters"
      />
    );
  }
  return (
    <div suppressHydrationWarning>
      {shouldUseTable ? (
        <ToJsonTable {...{ results, meanScaler, sortBy, sortDir }} />
      ) : (
        <ul className="json-schema-cards" aria-label="Results">
          {results.map((result: SchemaToJsonResult) => (
            <ToJsonCard key={result.id} {...{ result, meanScaler }} />
          ))}
        </ul>
      )}
    </div>
  );
}
