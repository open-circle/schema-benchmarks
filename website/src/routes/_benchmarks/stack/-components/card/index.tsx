import type { StackResult } from "@schema-benchmarks/bench";
import { getTransitionName, pluralize } from "@schema-benchmarks/utils";
import bem from "react-bem-helper";
import { ErrorBoundary } from "react-error-boundary";

import { DownloadCount } from "#/routes/_benchmarks/-components/count";
import { CodeBlock } from "#/shared/components/code";
import { MdSymbol } from "#/shared/components/symbol";
import { Bar } from "#/shared/components/table/bar";

interface StackCardProps {
  result: StackResult;
  barScale: ReturnType<typeof Bar.getScale>;
}

const cls = bem("stack-card");

export function StackCard({ result, barScale }: StackCardProps) {
  if (typeof result.line !== "number") return null;
  const messageLineCount = result.error.message.split("\n").length;
  const stackLineCount = result.error.stack?.split("\n").length ?? 0;
  const totalLineCount = messageLineCount + stackLineCount;
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
      <table className="minimal">
        <tbody>
          <tr>
            <th>Message length</th>
            <td className="numeric" style={{ whiteSpace: "pre" }}>
              {pluralize`${result.error.message.length} ${[result.error.message.length, "char"]}\n${messageLineCount} ${[
                messageLineCount,
                "line",
              ]}`}
            </td>
          </tr>
          <tr>
            <th>Stack length</th>
            <td className="numeric">{pluralize`${stackLineCount} ${[stackLineCount, "frame"]}`}</td>
          </tr>
          <tr>
            <th>Script found on frame</th>
            <td className="numeric">{result.line}</td>
          </tr>
          <tr></tr>
        </tbody>
      </table>
      <div {...cls({ element: "bar" })}>
        <Bar {...barScale(result.line)} />
      </div>
      <pre dir="ltr" {...cls({ element: "error", extra: "language-text line-numbers" })}>
        <code className="language-text">
          <span className="token">{result.error.name}</span>: {result.error.message}
          {result.error.stack && (
            <>
              {"\n"}
              <span className="token comment">{result.error.stack}</span>
            </>
          )}
          {totalLineCount > 1 && (
            <span className="line-numbers-rows">
              {new Array(totalLineCount).fill(null).map((_, i) => (
                <span key={i} />
              ))}
            </span>
          )}
        </code>
      </pre>
    </div>
  );
}
