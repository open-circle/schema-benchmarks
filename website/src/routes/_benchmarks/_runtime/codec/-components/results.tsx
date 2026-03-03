import { CodecResult } from "@schema-benchmarks/bench";
import { useMemo } from "react";

import { Bar } from "#/shared/components/table/bar";
import { useBreakpoints } from "#/shared/hooks/use-breakpoints";
import { SortDirection } from "#/shared/lib/sort";

import { SortableKey } from "../-constants";
import { CodecCard } from "./card";
import { CodecTable } from "./table";

export interface CodecResultsProps {
  results: Array<CodecResult>;
  sortBy: SortableKey;
  sortDir: SortDirection;
}

export function CodecResults({ results, sortBy, sortDir }: CodecResultsProps) {
  const shouldUseTable = useBreakpoints(["laptop", "desktop"], true);
  const encodeScaler = useMemo(
    () =>
      Bar.getScale(
        results.map((result) => result.encode.mean),
        { lowerBetter: true },
      ),
    [results],
  );
  const decodeScaler = useMemo(
    () =>
      Bar.getScale(
        results.map((result) => result.decode.mean),
        { lowerBetter: true },
      ),
    [results],
  );
  return (
    <div suppressHydrationWarning>
      {shouldUseTable ? (
        <CodecTable {...{ results, encodeScaler, decodeScaler, sortBy, sortDir }} />
      ) : (
        <div className="bench-cards">
          {results.map((result) => (
            <CodecCard key={result.libraryName} {...{ result, encodeScaler, decodeScaler }} />
          ))}
        </div>
      )}
    </div>
  );
}
