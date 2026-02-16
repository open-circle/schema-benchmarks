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

import { getCompiledPath } from "../../-query";
import { getDownloadTime } from "../../-speed";
import { DownloadCount } from "../../../-components/count";

interface DownloadCardProps {
  result: DownloadResult;
  mbps: number;
  minify: MinifyType;
  gzipScaler: ReturnType<typeof Bar.getScale>;
}

export function DownloadCard({ result, mbps, minify, gzipScaler }: DownloadCardProps) {
  return (
    <div
      className="card download-card"
      style={{
        viewTransitionName: getTransitionName("download-card", {
          libraryName: result.libraryName,
          note: result.note,
        }),
      }}
    >
      <h5 className="typo-overline download-card__version">{result.version}</h5>
      <div className="download-card__header-row">
        <header className="download-card__library-name">
          <h4 className="typo-headline5">
            <code className="language-text">{result.libraryName}</code>
          </h4>
          {result.note && <p className="typo-caption download-card__note">({result.note})</p>}
        </header>
        <ErrorBoundary fallback={null}>
          <div className="typo-body2 download-card__downloads">
            <MdSymbol>download</MdSymbol>
            <DownloadCount libraryName={result.libraryName} />
          </div>
        </ErrorBoundary>
      </div>
      <table className="minimal">
        <tbody>
          <tr>
            <th>Uncompressed</th>
            <td className="numeric">{formatBytes(result.bytes)}</td>
          </tr>
          <tr>
            <th>Gzipped</th>
            <td className="numeric">{formatBytes(result.gzipBytes)}</td>
          </tr>
          <tr>
            <th>Time</th>
            <td className="numeric">
              {durationFormatter.format(getDuration(getDownloadTime(result.gzipBytes, mbps)))}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="download-card__bar">
        <Bar {...gzipScaler(result.gzipBytes)} />
      </div>
      <div className="download-card__actions">
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
    </div>
  );
}
