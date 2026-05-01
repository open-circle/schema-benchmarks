import type { CodecResult } from "@schema-benchmarks/bench";
import { durationFormatter, getDuration, getTransitionName } from "@schema-benchmarks/utils";
import { ErrorBoundary } from "react-error-boundary";

import { ToggleButton } from "#/shared/components/button/toggle";
import { MdSymbol } from "#/shared/components/symbol";
import { Bar } from "#/shared/components/table/bar";
import { SortableHeaderLink } from "#/shared/components/table/sort";
import type { SortDirection } from "#/shared/lib/sort";

import type { SortableKey } from "../../-constants";
import { Snippet } from "../../../-components/table/snippet";
import { optimizeTypeProps } from "../../../-constants";
import { DownloadCount } from "../../../../-components/count";

export interface CodecTableProps {
  results: Array<CodecResult>;
  encodeScaler: ReturnType<typeof Bar.getScale>;
  decodeScaler: ReturnType<typeof Bar.getScale>;
  sortBy: SortableKey;
  sortDir: SortDirection;
}

export function CodecTable({ results, encodeScaler, decodeScaler, ...sortState }: CodecTableProps) {
  return (
    <div className="card" style={{ viewTransitionName: "bench-table" }}>
      <table className="bench-table">
        <thead>
          <tr>
            <SortableHeaderLink
              {...SortableHeaderLink.getProps("libraryName", sortState, { to: "/codec" })}
            >
              Library
            </SortableHeaderLink>
            <th className="action"></th>
            <th>Version</th>
            <SortableHeaderLink
              {...SortableHeaderLink.getProps(
                "downloads",
                sortState,
                { to: "/codec" },
                "descending",
              )}
              className="numeric"
            >
              Downloads (/wk)
            </SortableHeaderLink>
            <th>Optimizations</th>
            <SortableHeaderLink
              {...SortableHeaderLink.getProps("encode", sortState, { to: "/codec" })}
              className="numeric border-before"
              colSpan={2}
            >
              Encode
            </SortableHeaderLink>
            <th className="bar-after"></th>
            <SortableHeaderLink
              {...SortableHeaderLink.getProps("decode", sortState, { to: "/codec" })}
              className="numeric border-before"
              colSpan={2}
            >
              Decode
            </SortableHeaderLink>
            <th className="bar-after"></th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr
              key={result.id}
              style={{
                viewTransitionName: getTransitionName("bench-table-row", {
                  libraryName: result.libraryName,
                  note: result.note,
                }),
              }}
            >
              <td>
                <code className="language-text">{result.libraryName}</code>
                {result.note ? ` (${result.note})` : null}
              </td>
              <td className="action">
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
              </td>
              <td>
                <code className="language-text">{result.version}</code>
              </td>
              <td className="numeric">
                <ErrorBoundary fallback={null}>
                  <DownloadCount libraryName={result.libraryName} />
                </ErrorBoundary>
              </td>
              <td>{optimizeTypeProps.labels[result.optimizeType].label}</td>
              <td className="action border-before">
                <Snippet code={result.encode.snippet} />
              </td>
              <td className="numeric">
                {durationFormatter.format(getDuration(result.encode.mean))}
              </td>
              <td className="bar-after">
                <Bar {...encodeScaler(result.encode.mean)} />
              </td>
              <td className="action border-before">
                <Snippet code={result.decode.snippet} />
              </td>
              <td className="numeric">
                {durationFormatter.format(getDuration(result.decode.mean))}
              </td>
              <td className="bar-after">
                <Bar {...decodeScaler(result.decode.mean)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
