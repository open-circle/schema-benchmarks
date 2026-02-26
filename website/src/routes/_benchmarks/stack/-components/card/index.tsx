import type { StackResult } from "@schema-benchmarks/bench";
import { getTransitionName, OneOf } from "@schema-benchmarks/utils";
import bem from "react-bem-helper";
import { ErrorBoundary } from "react-error-boundary";

import { DownloadCount } from "#/routes/_benchmarks/-components/count";
import { CodeBlock } from "#/shared/components/code";
import { AnsiBlock } from "#/shared/components/code/ansi";
import { MdSymbol } from "#/shared/components/symbol";
import { Bar } from "#/shared/components/table/bar";

interface StackCardProps {
  result: OneOf<StackResult>;
  barScale: ReturnType<typeof Bar.getScale>;
}

const cls = bem("stack-card");

export function StackCard({ result, barScale }: StackCardProps) {
  return (
    <div
      {...cls()}
      style={{
        viewTransitionName: getTransitionName("stack-card", {
          libraryName: result.libraryName,
        }),
      }}
    >
      <h5 {...cls({ element: "version", extra: "typo-overline" })}>{result.version}</h5>
      <div {...cls({ element: "header-row" })}>
        <h4 {...cls({ element: "library-name", extra: "typo-headline5" })}>
          <code className="language-text">{result.libraryName}</code>
        </h4>
        <ErrorBoundary fallback={null}>
          <div {...cls({ element: "downloads", extra: "typo-body2" })}>
            <MdSymbol>download</MdSymbol>
            <DownloadCount libraryName={result.libraryName} />
          </div>
        </ErrorBoundary>
      </div>
      <CodeBlock>{result.snippet}</CodeBlock>
      {typeof result.line === "number" && (
        <div {...cls({ element: "bar" })}>
          <Bar {...barScale(result.line)} />
        </div>
      )}
      {result.output && (
        <details>
          <summary>
            <span>
              <MdSymbol>terminal</MdSymbol>
              Output
            </span>
          </summary>
          <AnsiBlock>{result.output}</AnsiBlock>
        </details>
      )}
    </div>
  );
}
