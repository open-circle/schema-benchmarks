import type { DownloadResult, MinifyType } from "@schema-benchmarks/bench";
import {
  durationFormatter,
  formatBytes,
  getDuration,
  getTransitionName,
} from "@schema-benchmarks/utils";
import bem from "react-bem-helper";
import { ErrorBoundary } from "react-error-boundary";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count";
import { getCompiledPath } from "#src/routes/_benchmarks/download/-query";
import { getDownloadTime } from "#src/routes/_benchmarks/download/-speed";
import { ButtonGroup } from "#src/shared/components/button";
import { InternalLinkToggleButton } from "#src/shared/components/button/toggle";
import { List, ListItem, ListItemContent } from "#src/shared/components/list";
import { MdSymbol } from "#src/shared/components/symbol";
import { Bar } from "#src/shared/components/table/bar";

export interface DownloadListProps {
  results: Array<DownloadResult>;
  mbps: number;
  minify: MinifyType;
  gzipScaler: ReturnType<typeof Bar.getScale>;
}

const cls = bem("download-list");

export function DownloadList({ results, mbps, minify, gzipScaler }: DownloadListProps) {
  return (
    <List aria-label="Results" {...cls()}>
      {results.map((result) => {
        const downloadTime = durationFormatter.format(
          getDuration(getDownloadTime(result.gzipBytes, mbps)),
        );
        const id = getTransitionName("download-list-item", {
          libraryName: result.libraryName,
          note: result.note,
        });
        return (
          <ListItem key={result.fileName} id={id} style={{ viewTransitionName: id }}>
            <details {...cls("item")}>
              <summary {...cls("summary")}>
                <ListItemContent
                  lines={3}
                  overline={<code className="language-text">{result.version}</code>}
                  primary={
                    <>
                      <code className="language-text">{result.libraryName}</code>
                      {result.note ? ` (${result.note})` : null}
                    </>
                  }
                  supporting={`${formatBytes(result.gzipBytes)} gzip | ${downloadTime}`}
                  trailing={
                    <span {...cls("bar")}>
                      <Bar {...gzipScaler(result.gzipBytes)} />
                    </span>
                  }
                />
              </summary>
              <div {...cls("details")}>
                <dl {...cls("metrics")}>
                  <div>
                    <dt>Uncompressed</dt>
                    <dd>{formatBytes(result.bytes)}</dd>
                  </div>
                  <div>
                    <dt>Gzipped</dt>
                    <dd>{formatBytes(result.gzipBytes)}</dd>
                  </div>
                  <div>
                    <dt>Time</dt>
                    <dd>{downloadTime}</dd>
                  </div>
                  <div>
                    <dt>Downloads / week</dt>
                    <dd>
                      <ErrorBoundary fallback={null}>
                        <span {...cls("downloads")}>
                          <DownloadCount libraryName={result.libraryName} />
                        </span>
                      </ErrorBoundary>
                    </dd>
                  </div>
                </dl>
                <div {...cls("actions")}>
                  <ButtonGroup className="source-links" ariaLabel="Links to files used">
                    <InternalLinkToggleButton
                      to="/repo/raw/$"
                      params={{
                        _splat: `schemas/libraries/${result.fileName}`,
                      }}
                      search={{ formatted: true }}
                      target="_blank"
                      preload={false}
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
                </div>
              </div>
            </details>
          </ListItem>
        );
      })}
    </List>
  );
}
