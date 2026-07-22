import type { StackResult } from "@schema-benchmarks/bench";
import { getTransitionName } from "@schema-benchmarks/utils";
import bem from "react-bem-helper";
import { ErrorBoundary } from "react-error-boundary";

import { DownloadCount } from "#/routes/_benchmarks/-components/count";
import { CodeBlock } from "#/shared/components/code";
import { AnsiBlock } from "#/shared/components/code/ansi";
import { MdSymbol } from "#/shared/components/symbol";
import { Bar } from "#/shared/components/table/bar";

import { highlightFrame } from "../../-constants";

interface StackCardProps {
  result: StackResult;
  frameScale: ReturnType<typeof Bar.getScale>;
  lineCountScale: ReturnType<typeof Bar.getScale>;
}

const cls = bem("stack-card");

export function StackCard({ result, frameScale, lineCountScale }: StackCardProps) {
  const id = getTransitionName("stack-card", {
    libraryName: result.libraryName,
  });
  return (
    <li id={id} aria-labelledby={`${id}-header`}>
      <article {...cls()} style={{ viewTransitionName: id }}>
        <h5 {...cls({ element: "version", extra: "typo-overline" })}>{result.version}</h5>
        <div {...cls({ element: "header-row" })}>
          <h4 {...cls({ element: "library-name", extra: "typo-headline5" })} id={`${id}-header`}>
            <code className="language-text">{result.libraryName}</code>
          </h4>
          <ErrorBoundary fallback={null}>
            <div {...cls({ element: "downloads", extra: "typo-body2" })}>
              <MdSymbol>download</MdSymbol>
              <DownloadCount libraryName={result.libraryName} />
            </div>
          </ErrorBoundary>
        </div>
        <dl className="minimal">
          {typeof result.frame === "number" && (
            <>
              <div {...cls({ element: "bar-row" })}>
                <dt>Frame #</dt>
                <dd>
                  {result.frame}

                  <Bar {...frameScale(result.frame)} />
                </dd>
              </div>
            </>
          )}
          <div {...cls({ element: "bar-row" })}>
            <dt>Line count</dt>
            <dd>
              {result.lineCount}
              <Bar {...lineCountScale(result.lineCount)} />
            </dd>
          </div>
        </dl>
        <CodeBlock>{result.snippet}</CodeBlock>
        <details>
          <summary>
            <span>
              <MdSymbol>terminal</MdSymbol>
              Output
            </span>
          </summary>
          <AnsiBlock lineNumbers>{highlightFrame(result.output)}</AnsiBlock>
        </details>
      </article>
    </li>
  );
}
