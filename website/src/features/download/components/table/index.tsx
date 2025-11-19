import type { DownloadResult, MinifyType } from "@schema-benchmarks/bench";
import {
  durationFormatter,
  formatBytes,
  getDuration,
} from "@schema-benchmarks/utils";
import { useMemo } from "react";
import { ButtonGroup, ExternalLinkToggleButton } from "@/components/button";
import { MdSymbol } from "@/components/symbol";
import { Bar } from "@/components/table/bar";
import { getDownloadTime } from "@/features/download/speed";

function getCompiledPath(result: DownloadResult, minify: MinifyType) {
  return result.fileName
    .replace("download.ts", `download_compiled/${minify}.js`)
    .replace("download/index.ts", `download_compiled/${minify}.js`)
    .replace("download/", `download_compiled/${minify}/`)
    .replace(".ts", ".js");
}

export interface DownloadTableProps {
  results: Array<DownloadResult>;
  mbps: number;
  minify: MinifyType;
}

export function DownloadTable({ results, mbps, minify }: DownloadTableProps) {
  const bytes = useMemo(() => results.map((result) => result.bytes), [results]);
  const sizeScaler = useMemo(
    () => Bar.getScale(bytes, { lowerBetter: true }),
    [bytes],
  );
  return (
    <div className="card">
      <table className="download-table">
        <thead>
          <tr>
            <th>Library</th>
            <th>Version</th>
            <th className="numeric">Size</th>
            <th className="bar-after"></th>
            <th className="numeric">Time</th>
            <th className="fit-content action"></th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => {
            const time = getDownloadTime(result.bytes, mbps);
            return (
              <tr key={result.fileName}>
                <td>
                  <code className="language-text">{result.libraryName}</code>
                  {result.note ? ` (${result.note})` : null}
                </td>
                <td>
                  <code className="language-text">{result.version}</code>
                </td>
                <td className="numeric">{formatBytes(result.bytes)}</td>
                <td className="bar-after">
                  <Bar {...sizeScaler(result.bytes)} />
                </td>
                <td className="numeric">
                  {durationFormatter.format(getDuration(time))}
                </td>
                <td className="action fit-content">
                  <ButtonGroup className="source-links">
                    <ExternalLinkToggleButton
                      href={`https://github.com/open-circle/schema-benchmarks/blob/main/schemas/libraries/${result.fileName}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label="View source"
                    >
                      <MdSymbol>code</MdSymbol>
                    </ExternalLinkToggleButton>
                    <ExternalLinkToggleButton
                      href={`https://github.com/open-circle/schema-benchmarks/blob/main/schemas/libraries/${getCompiledPath(
                        result,
                        minify,
                      )}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label="View compiled source"
                    >
                      <MdSymbol>deployed_code</MdSymbol>
                    </ExternalLinkToggleButton>
                  </ButtonGroup>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
