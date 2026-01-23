import type { BenchResult } from "@schema-benchmarks/bench";
import {
  durationFormatter,
  getDuration,
  getTransitionName,
} from "@schema-benchmarks/utils";
import { ErrorBoundary } from "react-error-boundary";
import { ChipCollection, DisplayChip } from "@/components/chip";
import { CodeBlock } from "@/components/code";
import { MdSymbol } from "@/components/symbol";
import { Bar } from "@/components/table/bar";
import { DownloadCount } from "@/features/popularity/components/count";
import { errorTypeProps, optimizeTypeProps } from "../../constants";

interface BenchCardProps {
  barScale: ReturnType<typeof Bar.getScale>;
  result: BenchResult;
}

export function BenchCard({ result, barScale }: BenchCardProps) {
  return (
    <div
      className="card bench-card"
      style={{
        viewTransitionName: getTransitionName("bench-card", {
          libraryName: result.libraryName,
          note: result.note,
          errorType: result.type === "parsing" ? result.errorType : undefined,
        }),
      }}
    >
      <h5 className="typo-overline bench-card__version">{result.version}</h5>
      <div className="bench-card__header-row">
        <header className="bench-card__library-name">
          <h4 className="typo-headline5">
            <code className="language-text">{result.libraryName}</code>
          </h4>
          {result.note && (
            <p className="typo-caption bench-card__note">({result.note})</p>
          )}
        </header>
        <ErrorBoundary fallback={null}>
          <div className="typo-body2 bench-card__downloads">
            <MdSymbol>download</MdSymbol>
            <DownloadCount libraryName={result.libraryName} />
          </div>
        </ErrorBoundary>
      </div>
      <CodeBlock>{result.snippet}</CodeBlock>
      <table className="minimal">
        <th>Mean</th>
        <td className="numeric">
          {durationFormatter.format(getDuration(result.mean))}
        </td>
      </table>
      <div className="bench-card__bar">
        <Bar {...barScale(result.mean)} />
      </div>
      <ChipCollection>
        <DisplayChip>
          <MdSymbol>
            {optimizeTypeProps.labels[result.optimizeType].icon}
          </MdSymbol>
          {optimizeTypeProps.labels[result.optimizeType].label}
        </DisplayChip>
        {result.type === "parsing" && (
          <DisplayChip>
            <MdSymbol>{errorTypeProps.labels[result.errorType].icon}</MdSymbol>
            {errorTypeProps.labels[result.errorType].label}
          </DisplayChip>
        )}
      </ChipCollection>
    </div>
  );
}
