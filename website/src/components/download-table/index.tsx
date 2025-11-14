import type { DownloadResult, MinifyType } from "@schema-benchmarks/bench";
import {
  durationFormatter,
  formatBytes,
  getDuration,
} from "@schema-benchmarks/utils";
import { useMemo } from "react";
import { getDownloadTime } from "@/data/results";
import { getBounds } from "@/data/scale";
import { useFocusGroup } from "@/hooks/use-focus-group";
import { getButtonClasses } from "../button";
import { Scaler } from "../scaler";
import { MdSymbol } from "../symbol";

export interface DownloadTableProps {
  results: Array<DownloadResult>;
  mbps: number;
  minify: MinifyType;
}

function SourceLinks({
  result,
  minify,
}: {
  result: DownloadResult;
  minify: MinifyType;
}) {
  const groupRef = useFocusGroup();
  return (
    <div className="source-links" ref={groupRef}>
      <a
        href={`https://github.com/open-circle/schema-benchmarks/blob/main/bench/schemas/download/${result.fileName}`}
        className={getButtonClasses({
          variant: "toggle",
        })}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="View source"
      >
        <MdSymbol>code</MdSymbol>
      </a>
      <a
        href={`https://github.com/open-circle/schema-benchmarks/blob/main/bench/schemas/download_compiled/${minify}/${result.fileName.replace(".ts", ".js")}`}
        className={getButtonClasses({
          variant: "toggle",
        })}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="View compiled source"
      >
        <MdSymbol>deployed_code</MdSymbol>
      </a>
    </div>
  );
}

export function DownloadTable({ results, mbps, minify }: DownloadTableProps) {
  const sizeBounds = useMemo(
    () => getBounds(results.map((result) => result.bytes)),
    [results],
  );
  return (
    <div className="card">
      <table className="download-table">
        <thead>
          <tr>
            <th className="fit-content numeric">Rank</th>
            <th>Library</th>
            <th className="numeric">Size</th>
            <th className="numeric">Time</th>
            <th className="fit-content action"></th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => {
            const time = getDownloadTime(result.bytes, mbps);
            return (
              <tr key={result.fileName}>
                <td className="fit-content numeric">{result.rank}</td>
                <td>
                  <code className="language-text">{result.libraryName}</code>
                  {result.note ? ` (${result.note})` : null}
                </td>
                <td className="numeric">
                  <Scaler value={result.bytes} bounds={sizeBounds} lowerBetter>
                    {formatBytes(result.bytes)}
                  </Scaler>
                </td>
                <td className="numeric">
                  {durationFormatter.format(getDuration(time))}
                </td>
                <td className="action fit-content">
                  <SourceLinks {...{ result, minify }} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
