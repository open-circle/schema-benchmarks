import type { DownloadResult, MinifyType } from "@schema-benchmarks/bench";
import { useMemo } from "react";

import type { SortableKey } from "#src/routes/_benchmarks/download/-constants";
import { EmptyState } from "#src/shared/components/empty-state";
import { MdSymbol } from "#src/shared/components/symbol";
import { Bar } from "#src/shared/components/table/bar";
import { useBreakpoints } from "#src/shared/hooks/use-breakpoints";
import type { SortDirection } from "#src/shared/lib/sort";

import { DownloadCard } from "./card";
import { DownloadTable } from "./table";

export interface DownloadResultsProps {
  results: Array<DownloadResult>;
  mbps: number;
  minify: MinifyType;
  sortBy: SortableKey;
  sortDir: SortDirection;
}

export function DownloadResults({ results, mbps, minify, sortBy, sortDir }: DownloadResultsProps) {
  const shouldUseTable = useBreakpoints(["laptop", "desktop"], true);
  const gzipScaler = useMemo(
    () =>
      Bar.getScale(
        results.map((result) => result.gzipBytes),
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
        <DownloadTable {...{ results, gzipScaler, mbps, minify, sortBy, sortDir }} />
      ) : (
        <ul className="download-cards" aria-label="Results">
          {results.map((result) => (
            <DownloadCard key={result.fileName} {...{ result, mbps, minify, gzipScaler }} />
          ))}
        </ul>
      )}
    </div>
  );
}
