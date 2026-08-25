import type { RuntimeResult } from "@schema-benchmarks/bench";
import type { DistributiveArray } from "@schema-benchmarks/utils";
import { formatDuration, getTransitionName } from "@schema-benchmarks/utils";
import bem from "react-bem-helper";
import { ErrorBoundary } from "react-error-boundary";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count";
import { errorTypeProps, optimizeTypeProps } from "#src/routes/_benchmarks/_runtime/-constants";
import { ButtonGroup } from "#src/shared/components/button";
import { ToggleButton } from "#src/shared/components/button/toggle";
import { CodeBlock } from "#src/shared/components/code";
import { List, ListItem, ListItemContent } from "#src/shared/components/list";
import { MdSymbol } from "#src/shared/components/symbol";
import { Bar } from "#src/shared/components/table/bar";

export interface BenchListProps {
  results: DistributiveArray<RuntimeResult>;
  meanScaler: ReturnType<typeof Bar.getScale>;
}

const cls = bem("bench-list");

export function BenchList({ results, meanScaler }: BenchListProps) {
  return (
    <List aria-label="Results" {...cls()}>
      {results.map((result) => {
        const optimizeLabel = optimizeTypeProps.labels[result.optimizeType].label;
        const hasErrorType = result.type === "parsing" || result.type === "standard";
        const errorLabel = hasErrorType ? errorTypeProps.labels[result.errorType].label : undefined;
        const id = getTransitionName("bench-list-item", {
          libraryName: result.libraryName,
          note: result.note,
          errorType: result.type === "parsing" ? result.errorType : undefined,
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
                  leading={
                    <MdSymbol>{optimizeTypeProps.labels[result.optimizeType].icon}</MdSymbol>
                  }
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
                  {(result.snippet.startsWith("//") || result.snippet.startsWith("/*")) && (
                    <p className="typo-caption">(Commented code is not benchmarked)</p>
                  )}
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
                        <span {...cls("downloads")}>
                          <DownloadCount libraryName={result.libraryName} />
                        </span>
                      </ErrorBoundary>
                    </dd>
                  </div>
                  <div>
                    <dt>Optimizations</dt>
                    <dd>
                      <span {...cls("group")}>
                        <MdSymbol>{optimizeTypeProps.labels[result.optimizeType].icon}</MdSymbol>
                        {optimizeLabel}
                      </span>
                    </dd>
                  </div>
                  {hasErrorType && (
                    <div>
                      <dt>Error type</dt>
                      <dd>
                        <span {...cls("group")}>
                          <MdSymbol>{errorTypeProps.labels[result.errorType].icon}</MdSymbol>
                          {errorLabel}
                        </span>
                      </dd>
                    </div>
                  )}
                </dl>

                <div {...cls("actions")}>
                  {(result.throws || result.sameObj) && (
                    <ButtonGroup ariaLabel="Library behavior">
                      {result.throws && (
                        <ToggleButton
                          tooltip={{
                            subhead: "Throws on invalid data",
                            supporting: (
                              <div style={{ maxWidth: "16rem" }}>
                                This library throws an error when parsing invalid data (and has no
                                non-throwing equivalent), so the benchmark includes a try/catch.
                              </div>
                            ),
                          }}
                        >
                          <MdSymbol>error</MdSymbol>
                        </ToggleButton>
                      )}
                      {result.sameObj && (
                        <ToggleButton
                          tooltip={{
                            subhead: "Returns the same object",
                            supporting: (
                              <div style={{ maxWidth: "16rem" }}>
                                This library returned the same object when parsing, instead of
                                creating a new object.
                              </div>
                            ),
                          }}
                        >
                          <MdSymbol>equal</MdSymbol>
                        </ToggleButton>
                      )}
                    </ButtonGroup>
                  )}
                </div>
              </div>
            </details>
          </ListItem>
        );
      })}
    </List>
  );
}
