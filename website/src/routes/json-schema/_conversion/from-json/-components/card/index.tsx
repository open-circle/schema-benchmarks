import type { SchemaFromJsonResult } from "@schema-benchmarks/bench";
import { formatDuration, getTransitionName } from "@schema-benchmarks/utils";
import { ErrorBoundary } from "react-error-boundary";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count";
import { cls } from "#src/routes/json-schema/_conversion/to-json/-components/card";
import { CodeBlock } from "#src/shared/components/code";
import { MdSymbol } from "#src/shared/components/symbol";
import { Bar } from "#src/shared/components/table/bar";

interface FromJsonCardProps {
  meanScaler: ReturnType<typeof Bar.getScale>;
  result: SchemaFromJsonResult;
}

export function FromJsonCard({ result, meanScaler }: FromJsonCardProps) {
  const { id } = result;
  return (
    <li id={id} aria-labelledby={`${id}-header`} data-testid="bench-card">
      <article
        {...cls()}
        style={{
          viewTransitionName: getTransitionName("json-schema-card", {
            libraryName: result.libraryName,
            note: result.note,
          }),
        }}
      >
        <h5 {...cls({ element: "version", extra: "typo-overline" })}>{result.version}</h5>
        <div {...cls("header-row")}>
          <header {...cls("library-name")} id={`${id}-header`}>
            <h4 className="typo-headline5">
              <code className="language-text">{result.libraryName}</code>
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
        <dl className="minimal">
          <div>
            <dt>Mean</dt>
            <dd>{formatDuration(result.mean)}</dd>
          </div>
        </dl>
        <div {...cls("bar")}>
          <Bar {...meanScaler(result.mean)} />
        </div>
      </article>
    </li>
  );
}
