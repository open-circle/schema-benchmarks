import type { ProcessedResult } from "@schema-benchmarks/bench";
import { useMemo } from "react";
import { getBounds } from "@/data/scale";
import { msToNs, numFormatter } from "@/utils";
import { CodeBlock } from "../code";
import { Scaler } from "../scaler";

export interface ResultsTableProps {
  results: Array<ProcessedResult>;
}

export function ResultsTable({ results }: ResultsTableProps) {
  const periodBounds = useMemo(
    () => getBounds(results.map((result) => result.period)),
    [results],
  );
  return (
    <div className="card">
      <table>
        <thead>
          <tr>
            <th data-numeric>Rank</th>
            <th>Library</th>
            <th data-numeric>Period (ns)</th>
            <th>Code</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.libraryName + (result.note ?? "")}>
              <td data-numeric>{result.rank}</td>
              <td>
                <code className="language-text">{result.libraryName}</code>
                {result.note ? (
                  <>
                    {" "}
                    <span>({result.note})</span>
                  </>
                ) : null}
              </td>
              <td data-numeric>
                <Scaler value={result.period} bounds={periodBounds} reverse>
                  {numFormatter.format(msToNs(result.period))}
                </Scaler>
              </td>
              <td>
                {result.snippet && <CodeBlock>{result.snippet}</CodeBlock>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
