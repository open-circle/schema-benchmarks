import type { BenchResult } from "@schema-benchmarks/bench";
import { durationFormatter, getDuration, getTransitionName } from "@schema-benchmarks/utils";
import bem from "react-bem-helper";
import { ErrorBoundary } from "react-error-boundary";

import { formatLibraryName } from "#/routes/_benchmarks/-lib";
import { ChipCollection, DisplayChip } from "#/shared/components/chip";
import { CodeBlock } from "#/shared/components/code";
import { MdSymbol } from "#/shared/components/symbol";
import { Bar } from "#/shared/components/table/bar";

import { errorTypeProps, optimizeTypeProps } from "../../-constants";
import { DownloadCount } from "../../../-components/count";

interface BenchCardProps {
  meanScaler: ReturnType<typeof Bar.getScale>;
  result: BenchResult;
}

const cls = bem("bench-card");

export function BenchCard({ result, meanScaler }: BenchCardProps) {
  return (
    <div
      {...cls()}
      style={{
        viewTransitionName: getTransitionName("bench-card", {
          libraryName: result.libraryName,
          note: result.note,
          errorType: result.type === "parsing" ? result.errorType : undefined,
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
      <CodeBlock>{result.snippet}</CodeBlock>
      <table className="minimal">
        <tbody>
          <tr>
            <th>Mean</th>
            <td className="numeric">{durationFormatter.format(getDuration(result.mean))}</td>
          </tr>
        </tbody>
      </table>
      <div {...cls("bar")}>
        <Bar {...meanScaler(result.mean)} />
      </div>
      <ChipCollection>
        <DisplayChip>
          <MdSymbol>{optimizeTypeProps.labels[result.optimizeType].icon}</MdSymbol>
          {optimizeTypeProps.labels[result.optimizeType].label}
        </DisplayChip>
        {(result.type === "parsing" || result.type === "standard") && (
          <DisplayChip>
            <MdSymbol>{errorTypeProps.labels[result.errorType].icon}</MdSymbol>
            {errorTypeProps.labels[result.errorType].label}
          </DisplayChip>
        )}
      </ChipCollection>
    </div>
  );
}
