import type { DownloadResult, MinifyType } from "@schema-benchmarks/bench";
import { useMemo } from "react";
import { Bar } from "@/shared/components/table/bar";
import { useBreakpoints } from "@/shared/hooks/use-breakpoints";
import { DownloadCard } from "./card";
import { DownloadTable } from "./table";

export interface DownloadResultsProps {
  results: Array<DownloadResult>;
  mbps: number;
  minify: MinifyType;
}

export function DownloadResults({
  results,
  mbps,
  minify,
}: DownloadResultsProps) {
  const shouldUseTable = useBreakpoints(["laptop", "desktop"], true);
  const gzipScaler = useMemo(
    () =>
      Bar.getScale(
        results.map((result) => result.gzipBytes),
        { lowerBetter: true },
      ),
    [results],
  );
  return (
    <div suppressHydrationWarning>
      {shouldUseTable ? (
        <DownloadTable results={results} mbps={mbps} minify={minify} />
      ) : (
        <div className="download-cards">
          {results.map((result) => (
            <DownloadCard
              key={result.fileName}
              {...{ result, mbps, minify, gzipScaler }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
