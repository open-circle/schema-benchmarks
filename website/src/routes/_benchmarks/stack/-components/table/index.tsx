import type { StackResult } from "@schema-benchmarks/bench";
import { getTransitionName } from "@schema-benchmarks/utils";

import { DownloadCount } from "#/routes/_benchmarks/-components/count";
import { Snippet } from "#/routes/_benchmarks/_runtime/-components/table/snippet";
import { Bar } from "#/shared/components/table/bar";
import { SortableHeaderLink } from "#/shared/components/table/sort";
import { SortDirection } from "#/shared/lib/sort";

import { SortableKey } from "../../-constants";
import { Output } from "./output";

export interface StackTableProps {
  results: Array<StackResult>;
  lineScale: ReturnType<typeof Bar.getScale>;
  sortBy: SortableKey;
  sortDir: SortDirection;
}

export function StackTable({ results, lineScale, ...sortState }: StackTableProps) {
  return (
    <div className="card" style={{ viewTransitionName: "stack-table" }}>
      <table className="stack-table">
        <thead>
          <tr>
            <SortableHeaderLink
              {...SortableHeaderLink.getProps("libraryName", sortState, { to: "/stack" })}
            >
              Library
            </SortableHeaderLink>
            <th className="action"></th>
            <th className="action"></th>
            <th>Version</th>
            <SortableHeaderLink
              {...SortableHeaderLink.getProps("downloads", sortState, { to: "/stack" })}
              className="numeric"
            >
              Downloads (/wk)
            </SortableHeaderLink>
            <SortableHeaderLink
              {...SortableHeaderLink.getProps("line", sortState, { to: "/stack" })}
              className="numeric"
            >
              Line
            </SortableHeaderLink>
            <th className="bar-after"></th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr
              key={result.libraryName}
              style={{
                viewTransitionName: getTransitionName("stack-table-row", {
                  libraryName: result.libraryName,
                }),
              }}
            >
              <td>
                <code className="language-text">{result.libraryName}</code>
              </td>
              <td className="action">
                <Snippet code={result.snippet} />
              </td>
              <td className="action">{result.output && <Output output={result.output} />}</td>
              <td>
                <code className="language-text">{result.version}</code>
              </td>
              <td className="numeric">
                <DownloadCount libraryName={result.libraryName} />
              </td>
              <td className="numeric">{result.line}</td>
              <td className="bar-after">
                {typeof result.line === "number" && <Bar {...lineScale(result.line)} />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
