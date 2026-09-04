import type { SchemaFromJsonResult } from "@schema-benchmarks/bench";
import { formatDuration, getTransitionName } from "@schema-benchmarks/utils";
import bem from "react-bem-helper";
import { ErrorBoundary } from "react-error-boundary";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count";
import { ResponsiveCodeBlock } from "#src/shared/components/code";
import { List, ListItem, ListItemContent } from "#src/shared/components/list";
import { Bar } from "#src/shared/components/table/bar";

export interface FromJsonListProps {
  results: Array<SchemaFromJsonResult>;
  meanScaler: ReturnType<typeof Bar.getScale>;
}

const cls = bem("json-schema-list");

export function FromJsonList({ results, meanScaler }: FromJsonListProps) {
  return (
    <List aria-label="Results" {...cls()}>
      {results.map((result) => {
        const id = getTransitionName("json-schema-list-item", {
          libraryName: result.libraryName,
          note: result.note,
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
                  supporting={formatDuration(result.mean)}
                  trailing={
                    <span {...cls("bar")}>
                      <Bar {...meanScaler(result.mean)} />
                    </span>
                  }
                />
              </summary>
              <div {...cls("details")}>
                <div {...cls("code")}>
                  <ResponsiveCodeBlock>{result.snippet}</ResponsiveCodeBlock>
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
                        <DownloadCount libraryName={result.libraryName} />
                      </ErrorBoundary>
                    </dd>
                  </div>
                </dl>
              </div>
            </details>
          </ListItem>
        );
      })}
    </List>
  );
}
