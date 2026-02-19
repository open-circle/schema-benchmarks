import type { DownloadResult, MinifyType } from "@schema-benchmarks/bench";
import {
  durationFormatter,
  formatBytes,
  getDuration,
  getTransitionName,
} from "@schema-benchmarks/utils";
import bem from "react-bem-helper";
import { ErrorBoundary } from "react-error-boundary";

import { formatLibraryName } from "#/routes/_benchmarks/-lib";
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

const cls = bem("download-card");

export function DownloadCard({ result, mbps, minify, gzipScaler }: DownloadCardProps) {
  return (
    <div
      {...cls()}
      style={{
        viewTransitionName: getTransitionName("download-card", {
          libraryName: result.libraryName,
          note: result.note,
        }),
      }}
    >
      <h5 {...cls({ element: "version", extra: "typo-overline" })}>{result.version}</h5>
      <div {...cls("header-row")}>
        <header {...cls("library-name")}>
          <h4 className="typo-headline5">
            <code className="language-text">{formatLibraryName(result.libraryName)}</code>
          </h4>
          {result.note && (
            <p {...cls({ element: "note", extra: "typo-caption" })}>({result.note})</p>
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
    </div>
  );
}
