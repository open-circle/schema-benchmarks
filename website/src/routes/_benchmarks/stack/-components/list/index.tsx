import type { StackResult } from "@schema-benchmarks/bench";
import { getTransitionName, numFormatter } from "@schema-benchmarks/utils";
import bem from "react-bem-helper";
import { ErrorBoundary } from "react-error-boundary";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count";
import type { SortableKey } from "#src/routes/_benchmarks/stack/-constants";
import { highlightFrame } from "#src/routes/_benchmarks/stack/-constants";
import { ResponsiveCodeBlock } from "#src/shared/components/code";
import { AnsiBlock } from "#src/shared/components/code/ansi";
import { List, ListItem, ListItemContent } from "#src/shared/components/list";
import type { BarProps } from "#src/shared/components/table/bar";
import { Bar } from "#src/shared/components/table/bar";
import { useNumberFormatter } from "#src/shared/hooks/format/use-number-formatter";

export interface StackListProps {
  results: Array<StackResult>;
  frameScale: ReturnType<typeof Bar.getScale>;
  lineCountScale: ReturnType<typeof Bar.getScale>;
  sortBy: SortableKey;
}

const cls = bem("stack-list");

export function StackList({ results, frameScale, lineCountScale, sortBy }: StackListProps) {
  const formatNumber = useNumberFormatter(numFormatter);
  return (
    <List aria-label="Results" {...cls()}>
      {results.map((result) => {
        const id = getTransitionName("stack-list-item", {
          libraryName: result.libraryName,
        });
        let summaryBar: BarProps | undefined;
        if (sortBy === "frame" && typeof result.frame === "number") {
          summaryBar = frameScale(result.frame);
        }
        if (sortBy === "lineCount") {
          summaryBar = lineCountScale(result.lineCount);
        }
        const frameLabel = typeof result.frame === "number" ? formatNumber(result.frame) : "n/a";
        const lineCountLabel = formatNumber(result.lineCount);
        return (
          <ListItem key={result.libraryName} id={id} style={{ viewTransitionName: id }}>
            <details {...cls("item")}>
              <summary {...cls("summary")}>
                <ListItemContent
                  lines={3}
                  overline={<code className="language-text">{result.version}</code>}
                  primary={<code className="language-text">{result.libraryName}</code>}
                  supporting={`frame ${frameLabel} | ${lineCountLabel} lines`}
                  trailing={
                    summaryBar && (
                      <span {...cls("bar")}>
                        <Bar {...summaryBar} />
                      </span>
                    )
                  }
                />
              </summary>

              <div {...cls("details")}>
                <div {...cls("code")}>
                  <h6 className="typo-subtitle2">Snippet</h6>
                  <ResponsiveCodeBlock fileName={`${result.libraryName}.ts`}>
                    {result.snippet}
                  </ResponsiveCodeBlock>
                </div>

                {!!result.output && (
                  <div {...cls("code")}>
                    <h6 className="typo-subtitle2">Output</h6>
                    <AnsiBlock lineNumbers>{highlightFrame(result.output)}</AnsiBlock>
                  </div>
                )}

                <dl {...cls("metrics")}>
                  <div>
                    <dt>Frame #</dt>
                    <dd>{frameLabel}</dd>
                  </div>
                  <div>
                    <dt>Line count</dt>
                    <dd>{lineCountLabel}</dd>
                  </div>
                  <div>
                    <dt>Downloads / wk</dt>
                    <dd>
                      <ErrorBoundary fallback={null}>
                        <span {...cls("downloads")}>
                          <DownloadCount libraryName={result.libraryName} />
                        </span>
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
