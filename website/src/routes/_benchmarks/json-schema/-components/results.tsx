import type { JsonSchemaResult } from "@schema-benchmarks/bench";
import { useMemo } from "react";

import type { SortableKey } from "#src/routes/_benchmarks/_runtime/-constants";
import { EmptyState } from "#src/shared/components/empty-state";
import { MdSymbol } from "#src/shared/components/symbol";
import { Bar } from "#src/shared/components/table/bar";
import { useBreakpoints } from "#src/shared/hooks/use-breakpoints";
import type { SortDirection } from "#src/shared/lib/sort";

import { JsonSchemaCard } from "./card";
import { JsonSchemaTable } from "./table";

export interface JsonSchemaBenchResultsProps {
  results: Array<JsonSchemaResult>;
  sortBy: SortableKey;
  sortDir: SortDirection;
}

export function JsonSchemaResults({ results, ...props }: JsonSchemaBenchResultsProps) {
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
        <JsonSchemaTable {...{ results, meanScaler }} to="/json-schema" {...props} />
      ) : (
        <ul className="json-schema-cards" aria-label="Results">
          {results.map((result) => (
            <JsonSchemaCard key={result.id} {...{ result, meanScaler }} />
          ))}
        </ul>
      )}
    </div>
  );
}
