import type { DownloadResult, MinifyType } from "@schema-benchmarks/bench";
import {
  durationFormatter,
  formatBytes,
  getDuration,
  getTransitionName,
} from "@schema-benchmarks/utils";
import { ErrorBoundary } from "react-error-boundary";

import { ButtonGroup } from "#/shared/components/button";
import { InternalLinkToggleButton } from "#/shared/components/button/toggle";
import { MdSymbol } from "#/shared/components/symbol";
import { Bar } from "#/shared/components/table/bar";
import { SortableHeaderLink } from "#/shared/components/table/sort";
import { SortDirection } from "#/shared/lib/sort";

import { SortableKey } from "../../-constants";
import { getCompiledPath } from "../../-query";
import { getDownloadTime } from "../../-speed";
import { DownloadCount } from "../../../-components/count";

export interface DownloadTableProps {
  results: Array<DownloadResult>;
  gzipScaler: ReturnType<typeof Bar.getScale>;
  mbps: number;
  minify: MinifyType;
  sortBy: SortableKey;
  sortDir: SortDirection;
}

export function DownloadTable({
  results,
  gzipScaler,
  mbps,
  minify,
  ...sortState
}: DownloadTableProps) {
  return (
    <div className="card" style={{ viewTransitionName: "download-table" }}>
      <table className="download-table">
        <thead>
          <tr>
            <SortableHeaderLink
              {...SortableHeaderLink.getProps("libraryName", sortState, { to: "/download" })}
            >
              Library
            </SortableHeaderLink>
            <th>Version</th>
            <SortableHeaderLink
              {...SortableHeaderLink.getProps(
                "downloads",
                sortState,
                { to: "/download" },
                "descending",
              )}
              className="numeric"
            >
              Downloads (/wk)
            </SortableHeaderLink>
            <SortableHeaderLink
              {...SortableHeaderLink.getProps("bytes", sortState, { to: "/download" })}
              className="numeric"
            >
              Uncompressed
            </SortableHeaderLink>
            <SortableHeaderLink
              {...SortableHeaderLink.getProps("gzipBytes", sortState, { to: "/download" })}
              className="numeric"
            >
              Gzipped
            </SortableHeaderLink>
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
                <td className="numeric">{durationFormatter.format(getDuration(gzipTime))}</td>
                <td className="action fit-content">
                  <ButtonGroup className="source-links" ariaLabel="Links to files used">
                    <InternalLinkToggleButton
                      to="/repo/raw/$"
                      params={{
                        _splat: `schemas/libraries/${result.fileName}`,
                      }}
                      preload={false}
                      target="_blank"
                      rel="noreferrer noopener"
                      tooltip="Open source"
                    >
                      <MdSymbol>code</MdSymbol>
                    </InternalLinkToggleButton>
                    <InternalLinkToggleButton
                      to="/repo/raw/$"
                      params={{
                        _splat: `schemas/libraries/${getCompiledPath(result.fileName, minify)}`,
                      }}
                      preload={false}
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
