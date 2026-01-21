import type { DownloadResult, MinifyType } from "@schema-benchmarks/bench";
import {
  durationFormatter,
  formatBytes,
  getDuration,
  getTransitionName,
} from "@schema-benchmarks/utils";
import { useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ButtonGroup } from "@/components/button";
import { InternalLinkToggleButton } from "@/components/button/toggle";
import { MdSymbol } from "@/components/symbol";
import { Bar } from "@/components/table/bar";
import { getDownloadTime } from "@/features/download/speed";
import { DownloadCount } from "@/features/popularity/components/count";
import { getCompiledPath } from "../../query";

export interface DownloadTableProps {
  results: Array<DownloadResult>;
  mbps: number;
  minify: MinifyType;
}

export function DownloadTable({ results, mbps, minify }: DownloadTableProps) {
  const gzipScaler = useMemo(
    () =>
      Bar.getScale(
        results.map((result) => result.gzipBytes),
        { lowerBetter: true },
      ),
    [results],
  );
  return (
    <div className="card" style={{ viewTransitionName: "download-table" }}>
      <table className="download-table">
        <thead>
          <tr>
            <th>Library</th>
            <th>Version</th>
            <th className="numeric">Downloads (weekly)</th>
            <th className="numeric">Uncompressed</th>
            <th className="numeric">Gzipped</th>
            <th className="bar-after"></th>
            <th className="numeric">Time</th>
            <th className="fit-content action"></th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => {
            const gzipTime = getDownloadTime(result.gzipBytes, mbps);
            return (
              <tr
                key={result.fileName}
                style={{
                  viewTransitionName: getTransitionName("download-table-row", {
                    libraryName: result.libraryName,
                    note: result.note,
                  }),
                }}
              >
                <td>
                  <code className="language-text">{result.libraryName}</code>
                  {result.note ? ` (${result.note})` : null}
                </td>
                <td>
                  <code className="language-text">{result.version}</code>
                </td>
                <td className="numeric">
                  <ErrorBoundary fallback={null}>
                    <DownloadCount libraryName={result.libraryName} />
                  </ErrorBoundary>
                </td>
                <td className="numeric">{formatBytes(result.bytes)}</td>
                <td className="numeric">{formatBytes(result.gzipBytes)}</td>
                <td className="bar-after">
                  <Bar {...gzipScaler(result.gzipBytes)} />
                </td>
                <td className="numeric">
                  {durationFormatter.format(getDuration(gzipTime))}
                </td>
                <td className="action fit-content">
                  <ButtonGroup
                    className="source-links"
                    ariaLabel="Links to files used"
                  >
                    <InternalLinkToggleButton
                      to="/repo/raw/$"
                      params={{
                        _splat: `schemas/libraries/${result.fileName}`,
                      }}
                      target="_blank"
                      rel="noreferrer noopener"
                      tooltip="Open source"
                    >
                      <MdSymbol>code</MdSymbol>
                    </InternalLinkToggleButton>
                    <InternalLinkToggleButton
                      to="/repo/raw/$"
                      params={{
                        _splat: `schemas/libraries/${getCompiledPath(
                          result.fileName,
                          minify,
                        )}`,
                      }}
                      target="_blank"
                      rel="noreferrer noopener"
                      tooltip="Open compiled"
                    >
                      <MdSymbol>deployed_code</MdSymbol>
                    </InternalLinkToggleButton>
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
