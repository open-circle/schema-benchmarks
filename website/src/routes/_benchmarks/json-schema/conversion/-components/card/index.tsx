import type { JsonSchemaResult } from "@schema-benchmarks/bench";
import { formatDuration, getTransitionName } from "@schema-benchmarks/utils";
import bem from "react-bem-helper";
import { ErrorBoundary } from "react-error-boundary";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count";
import { GeneratedJsonSchema } from "#src/routes/_benchmarks/json-schema/conversion/-components/json-schema";
import {
  jsonSchemaDirectionProps,
  jsonSchemaSourceProps,
  standardJsonSchemaProps,
  jsonSchemaTargetProps,
} from "#src/routes/_benchmarks/json-schema/conversion/-constants";
import { ChipCollection, DisplayChip } from "#src/shared/components/chip";
import { CodeBlock } from "#src/shared/components/code";
import { MdSymbol } from "#src/shared/components/symbol";
import { Bar } from "#src/shared/components/table/bar";

interface JsonSchemaBenchCardProps {
  meanScaler: ReturnType<typeof Bar.getScale>;
  result: JsonSchemaResult;
}

export const cls = bem("json-schema-card");

export function JsonSchemaCard({ result, meanScaler }: JsonSchemaBenchCardProps) {
  const { id } = result;
  return (
    <li id={id} aria-labelledby={`${id}-header`} data-testid="bench-card">
      <article
        {...cls()}
        style={{
          viewTransitionName: getTransitionName("json-schema-card", {
            libraryName: result.libraryName,
            note: result.note,
            direction: result.direction,
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
        <div {...cls("chips")}>
          <ChipCollection data-testid="bench-card-chips">
            <DisplayChip>
              <MdSymbol>{jsonSchemaSourceProps.labels[result.source].icon}</MdSymbol>
              {jsonSchemaSourceProps.labels[result.source].label}
            </DisplayChip>
            <DisplayChip>
              <MdSymbol>{standardJsonSchemaProps.labels[result.standardJsonSchema].icon}</MdSymbol>
              {`Standard JSON Schema: ${standardJsonSchemaProps.labels[result.standardJsonSchema].label}`}
            </DisplayChip>
            <DisplayChip>
              <MdSymbol>{jsonSchemaTargetProps.labels[result.target].icon}</MdSymbol>
              {jsonSchemaTargetProps.labels[result.target].label}
            </DisplayChip>
            <DisplayChip>
              <MdSymbol>{jsonSchemaDirectionProps.labels[result.direction].icon}</MdSymbol>
              {jsonSchemaDirectionProps.labels[result.direction].label}
            </DisplayChip>
          </ChipCollection>
          <GeneratedJsonSchema jsonSchema={result.jsonSchema} />
        </div>
      </article>
    </li>
  );
}
