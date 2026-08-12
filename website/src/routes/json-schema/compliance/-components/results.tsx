import type { JsonComplianceResult } from "@schema-benchmarks/bench";

import type { SortableKey } from "#src/routes/json-schema/compliance/-constants.tsx";
import { useBreakpoints } from "#src/shared/hooks/use-breakpoints.ts";
import type { SortDirection } from "#src/shared/lib/sort.ts";

import { ComplianceList } from "./list";
import { ComplianceTable } from "./table";

export interface ComplianceResultsProps {
  results: Array<JsonComplianceResult>;
  sortBy: SortableKey;
  sortDir: SortDirection;
}

export function ComplianceResults({ results, ...sortState }: ComplianceResultsProps) {
  const shouldUseTable = useBreakpoints(["laptop", "desktop"], true);
  return (
    <div suppressHydrationWarning>
      {shouldUseTable ? (
        <div className="centred-table">
          <ComplianceTable {...{ results, ...sortState }} />
        </div>
      ) : (
        <ComplianceList results={results} />
      )}
    </div>
  );
}
