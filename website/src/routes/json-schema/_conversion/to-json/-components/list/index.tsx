import type { SchemaToJsonResult } from "@schema-benchmarks/bench";
import { formatDuration, getTransitionName } from "@schema-benchmarks/utils";
import bem from "react-bem-helper";
import { ErrorBoundary } from "react-error-boundary";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count";
import { GeneratedJsonSchema } from "#src/routes/json-schema/_conversion/-components/json-schema";
import { jsonSchemaDirectionProps } from "#src/routes/json-schema/_conversion/-constants";
import { CodeBlock } from "#src/shared/components/code";
import { List, ListItem, ListItemContent } from "#src/shared/components/list";
import { MdSymbol } from "#src/shared/components/symbol/index.tsx";
import { Bar } from "#src/shared/components/table/bar";

export interface ToJsonListProps {
  results: Array<SchemaToJsonResult>;
  meanScaler: ReturnType<typeof Bar.getScale>;
}

const cls = bem("json-schema-list");

export function ToJsonList({ results, meanScaler }: ToJsonListProps) {
  return (
    <List aria-label="Results" {...cls()}>
      {results.map((result) => {
        const directionLabel = jsonSchemaDirectionProps.labels[result.direction].label;
        const id = getTransitionName("json-schema-list-item", {
          libraryName: result.libraryName,
          note: result.note,
          direction: result.direction,
        });

        return (
          <ListItem key={result.id} id={id} style={{ viewTransitionName: id }}>
            <details {...cls("item")}>
              <summary {...cls("summary")}>
                <ListItemContent
                  lines={3}
                  overline={<code className="language-text">{result.version}</code>}
                  primary={
                    <>
                      <code className="language-text">{result.libraryName}</code>
                      {result.note ? ` (${result.note})` : null}
                    </>
                  }
                  leading={
                    <MdSymbol>{jsonSchemaDirectionProps.labels[result.direction].icon}</MdSymbol>
                  }
                  supporting={`${formatDuration(result.mean)} | ${directionLabel}`}
                  trailing={
                    <span {...cls("bar")}>
                      <Bar {...meanScaler(result.mean)} />
                    </span>
                  }
                />
              </summary>
              <div {...cls("details")}>
                <div {...cls("code")}>
                  <CodeBlock>{result.snippet}</CodeBlock>
                </div>
                <dl {...cls("metrics")}>
                  <div>
                    <dt>Mean</dt>
                    <dd>{formatDuration(result.mean)}</dd>
                  </div>
                  <div>
                    <dt>Downloads / wk</dt>
                    <dd>
                      <ErrorBoundary fallback={null}>
                        <DownloadCount libraryName={result.libraryName} useLink={false} />
                      </ErrorBoundary>
                    </dd>
                  </div>
                  <div>
                    <dt>Type</dt>
                    <dd>{directionLabel}</dd>
                  </div>
                </dl>
                <div {...cls("actions")}>
                  <GeneratedJsonSchema jsonSchema={result.jsonSchema} />
                </div>
              </div>
            </details>
          </ListItem>
        );
      })}
    </List>
  );
}
