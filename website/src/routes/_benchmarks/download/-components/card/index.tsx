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
import { MdSymbol } from "#src/shared/components/symbol";
import { Bar } from "#src/shared/components/table/bar";

interface DownloadCardProps {
  result: DownloadResult;
  mbps: number;
  minify: MinifyType;
  gzipScaler: ReturnType<typeof Bar.getScale>;
}

const cls = bem("download-card");

export function DownloadCard({ result, mbps, minify, gzipScaler }: DownloadCardProps) {
  const id = getTransitionName("download-card", {
    libraryName: result.libraryName,
    note: result.note,
  });
  return (
    <li id={id} aria-labelledby={`${id}-header`}>
      <article {...cls()} style={{ viewTransitionName: id }}>
        <p {...cls({ element: "version", extra: "typo-overline" })}>{result.version}</p>
        <div {...cls("header-row")}>
          <header {...cls("library-name")} id={`${id}-header`}>
            <h4 className="typo-headline5">
              <code className="language-text">{result.libraryName}</code>
            </h4>
            {result.note && (
              <span {...cls({ element: "note", extra: "typo-caption" })}>({result.note})</span>
            )}
          </header>
          <ErrorBoundary fallback={null}>
            <div {...cls({ element: "downloads", extra: "typo-body2" })}>
              <MdSymbol>download</MdSymbol>
              <DownloadCount libraryName={result.libraryName} />
              {" / wk"}
            </div>
          </ErrorBoundary>
        </div>
        <dl className="minimal">
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
            <dd>
              {durationFormatter.format(getDuration(getDownloadTime(result.gzipBytes, mbps)))}
            </dd>
          </div>
        </dl>
        <div {...cls("bar")}>
          <Bar {...gzipScaler(result.gzipBytes)} />
        </div>
        <div {...cls("actions")}>
          <ButtonGroup variant="outlined" className="source-links" ariaLabel="Links to files used">
            <InternalLinkToggleButton
              to="/repo/raw/$"
              params={{
                _splat: `schemas/libraries/${result.fileName}`,
              }}
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
      </article>
    </li>
  );
}
