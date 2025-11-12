import type { ProcessedResult } from "@schema-benchmarks/bench";
import { useEffect, useMemo, useState } from "react";
import { type Bounds, getBounds } from "@/data/scale";
import { msToNs, numFormatter } from "@/utils";
import { CodeBlock } from "../code";
import { Radio } from "../radio";
import { Scaler } from "../scaler";
import { MdSymbol } from "../symbol";

export interface ResultsTableProps {
  results: Array<ProcessedResult>;
}

function useComparison(results: Array<ProcessedResult>) {
  const [compareId, setCompareId] = useState(results[0]?.id);
  useEffect(() => {
    setCompareId(results[0]?.id);
  }, [results]);
  const resultsById = useMemo(() => {
    return Object.fromEntries(results.map((result) => [result.id, result]));
  }, [results]);
  const compareResult = compareId && resultsById[compareId];
  const ratioBounds = useMemo((): Bounds | undefined => {
    if (!compareResult) return undefined;
    const highestRatio = Math.max(
      ...results.map((result) => {
        if (result.mean < compareResult.mean) {
          return -(compareResult.mean / result.mean);
        }
        return result.mean / compareResult.mean;
      }),
    );
    return {
      highest: highestRatio,
      lowest: -highestRatio,
    };
  }, [results, compareResult]);
  return { compareId, setCompareId, compareResult, ratioBounds };
}

export function ResultsTable({ results }: ResultsTableProps) {
  const meanBounds = useMemo(
    () => getBounds(results.map((result) => result.mean)),
    [results],
  );
  const { compareId, setCompareId, compareResult, ratioBounds } =
    useComparison(results);
  if (!results.length) {
    return (
      <div className="empty-state">
        <MdSymbol>database_off</MdSymbol>
        <p className="headline5">No results found</p>
        <p className="body2">Try a different combination of filters</p>
      </div>
    );
  }
  return (
    <div className="card">
      <table>
        <thead>
          <tr>
            <th data-numeric>Rank</th>
            <th>Library</th>
            <th data-numeric>Mean (ns)</th>
            <th>Code</th>
            <th data-action>Compare</th>
            <th data-numeric>Ratio</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => {
            return (
              <tr key={result.id}>
                <td data-numeric>{result.rank}</td>
                <td>
                  <code className="language-text">{result.libraryName}</code>
                  {result.note ? ` (${result.note})` : null}
                </td>
                <td data-numeric>
                  <Scaler value={result.mean} bounds={meanBounds} reverse>
                    {numFormatter.format(msToNs(result.mean))}
                  </Scaler>
                </td>
                <td>
                  {result.snippet && <CodeBlock>{result.snippet}</CodeBlock>}
                </td>
                <td data-action>
                  <Radio
                    name="compare"
                    value={result.id}
                    checked={compareId === result.id}
                    onChange={(event) => {
                      setCompareId(
                        event.target.checked ? result.id : undefined,
                      );
                    }}
                  />
                </td>
                <td data-numeric>
                  {compareResult &&
                    ratioBounds &&
                    compareId !== result.id &&
                    (result.mean < compareResult.mean ? (
                      <Scaler
                        value={-(compareResult.mean / result.mean)}
                        bounds={ratioBounds}
                        type="stat"
                        reverse
                      >
                        Selected is{" "}
                        {numFormatter.format(compareResult.mean / result.mean)}x
                        slower
                      </Scaler>
                    ) : (
                      <Scaler
                        value={result.mean / compareResult.mean}
                        bounds={ratioBounds}
                        type="stat"
                        reverse
                      >
                        Selected is{" "}
                        {numFormatter.format(result.mean / compareResult.mean)}x
                        faster
                      </Scaler>
                    ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
