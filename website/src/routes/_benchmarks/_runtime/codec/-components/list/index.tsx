import type { CodecResult } from "@schema-benchmarks/bench";
import { durationFormatter, getDuration, getTransitionName } from "@schema-benchmarks/utils";
import bem from "react-bem-helper";
import { ErrorBoundary } from "react-error-boundary";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count";
import { optimizeTypeProps } from "#src/routes/_benchmarks/_runtime/-constants";
import { ToggleButton } from "#src/shared/components/button/toggle";
import { ResponsiveCodeBlock } from "#src/shared/components/code";
import { List, ListItem, ListItemContent } from "#src/shared/components/list";
import { MdSymbol } from "#src/shared/components/symbol";
import { Bar } from "#src/shared/components/table/bar";

export interface CodecListProps {
  results: Array<CodecResult>;
  encodeScaler: ReturnType<typeof Bar.getScale>;
  decodeScaler: ReturnType<typeof Bar.getScale>;
}

const cls = bem("codec-list");

function isCommented(code: string) {
  return code.startsWith("//") || code.startsWith("/*");
}

export function CodecList({ results, encodeScaler, decodeScaler }: CodecListProps) {
  return (
    <List aria-label="Results" {...cls()}>
      {results.map((result) => {
        const encodeMean = durationFormatter.format(getDuration(result.encode.mean));
        const decodeMean = durationFormatter.format(getDuration(result.decode.mean));
        const optimizeLabel = optimizeTypeProps.labels[result.optimizeType].label;
        const id = getTransitionName("codec-list-item", {
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
                  supporting={`${encodeMean} enc | ${decodeMean} dec | ${optimizeLabel}`}
                  leading={
                    <MdSymbol>{optimizeTypeProps.labels[result.optimizeType].icon}</MdSymbol>
                  }
                  trailing={
                    <span {...cls("summary-trailing")}>
                      <span {...cls("bar")}>
                        <Bar {...encodeScaler(result.encode.mean)} />
                      </span>
                      <span {...cls("bar")}>
                        <Bar {...decodeScaler(result.decode.mean)} />
                      </span>
                    </span>
                  }
                />
              </summary>

              <div {...cls("details")}>
                <div {...cls("code")}>
                  <h6 className="typo-subtitle2">Encode</h6>
                  <ResponsiveCodeBlock>{result.encode.snippet}</ResponsiveCodeBlock>
                  {isCommented(result.encode.snippet) && (
                    <p className="typo-caption">(Commented code is not benchmarked)</p>
                  )}
                </div>

                <div {...cls("code")}>
                  <h6 className="typo-subtitle2">Decode</h6>
                  <ResponsiveCodeBlock>{result.decode.snippet}</ResponsiveCodeBlock>
                  {isCommented(result.decode.snippet) && (
                    <p className="typo-caption">(Commented code is not benchmarked)</p>
                  )}
                </div>

                <dl {...cls("metrics")}>
                  <div>
                    <dt>Encode</dt>
                    <dd>{encodeMean}</dd>
                  </div>
                  <div>
                    <dt>Decode</dt>
                    <dd>{decodeMean}</dd>
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
                </dl>

                <div {...cls("actions")}>
                  {result.acceptsUnknown && (
                    <ToggleButton
                      tooltip={{
                        subhead: "Accepts unknown values",
                        supporting: "This codec allows unknown input, requiring extra validation.",
                      }}
                    >
                      <MdSymbol>warning</MdSymbol>
                    </ToggleButton>
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
