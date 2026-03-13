import type { StackResult } from "@schema-benchmarks/bench";
import { getTransitionName } from "@schema-benchmarks/utils";

import { DownloadCount } from "#/routes/_benchmarks/-components/count";
import { Snippet } from "#/routes/_benchmarks/_runtime/-components/table/snippet";
import { Bar } from "#/shared/components/table/bar";
import { SortableHeaderLink } from "#/shared/components/table/sort";
import type { SortDirection } from "#/shared/lib/sort";

import type { SortableKey } from "../../-constants";
import { Output } from "./output";

export interface StackTableProps {
  results: Array<StackResult>;
  frameScale: ReturnType<typeof Bar.getScale>;
  lineCountScale: ReturnType<typeof Bar.getScale>;
  sortBy: SortableKey;
  sortDir: SortDirection;
}

export function StackTable({ results, frameScale, lineCountScale, ...sortState }: StackTableProps) {
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
              {...SortableHeaderLink.getProps("frame", sortState, { to: "/stack" })}
              className="numeric"
            >
              Frame #
            </SortableHeaderLink>
            <th className="bar-after"></th>
            <SortableHeaderLink
              {...SortableHeaderLink.getProps("lineCount", sortState, { to: "/stack" })}
              className="numeric"
            >
              Line count
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
              <td className="numeric">{result.frame}</td>
              <td className="bar-after">
                {typeof result.frame === "number" && <Bar {...frameScale(result.frame)} />}
              </td>
              <td className="numeric">{result.lineCount}</td>
              <td className="bar-after">
                <Bar {...lineCountScale(result.lineCount)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
