import type { ProcessedResult } from "@schema-benchmarks/bench";
import { msToNs, numFormatter } from "@schema-benchmarks/utils";
import { useEffect, useMemo, useState } from "react";
import { getBounds } from "@/data/scale";
import { CodeBlock } from "../code";
import { Radio } from "../radio";
import { Scaler } from "../scaler";
import { MdSymbol } from "../symbol";

export interface ResultsTableProps {
  results: Array<ProcessedResult>;
}

const getRatio = (a: number, b: number) => {
  if (a === b) return 0;
  if (a < b) return -(b / a);
  return a / b;
};

function useComparison(results: Array<ProcessedResult>) {
  const [compareId, setCompareId] = useState(results[0]?.id);
  useEffect(() => {
    setCompareId(results[0]?.id);
  }, [results]);
  const resultsById = useMemo(() => {
    return Object.fromEntries(results.map((result) => [result.id, result]));
  }, [results]);
  const compareResult = compareId && resultsById[compareId];
  const ratioBounds = useMemo(() => {
    if (!compareResult) return undefined;
    return getBounds(
      results.map((result) => getRatio(result.mean, compareResult.mean)),
      {
        percentiles: { low: 5, high: 95 },
      },
    );
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
  const showComparisonColumns = results.length > 1;
  return (
    <div className="card">
      <table className="results-table">
        <thead>
          <tr>
            <th className="fit-content numeric">Rank</th>
            <th>Library</th>
            <th className="numeric fit-content">Mean (ns)</th>
            <th className="fit-content">Code</th>
            {showComparisonColumns && (
              <>
                <th className="fit-content action">Compare</th>
                <th className="numeric fit-content">Ratio</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {results.map((result) => {
            const ratio =
              compareResult && getRatio(result.mean, compareResult.mean);
            return (
              <tr key={result.id}>
                <td className="fit-content numeric">{result.rank}</td>
                <td>
                  <code className="language-text">{result.libraryName}</code>
                  {result.note ? ` (${result.note})` : null}
                </td>
                <td className="numeric fit-content">
                  <Scaler value={result.mean} bounds={meanBounds} reverse>
                    {numFormatter.format(msToNs(result.mean))}
                  </Scaler>
                </td>
                <td className="fit-content">
                  {result.snippet && <CodeBlock>{result.snippet}</CodeBlock>}
                </td>
                {showComparisonColumns && (
                  <>
                    <td className="fit-content action">
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
                    <td className="numeric fit-content">
                      {compareResult &&
                        ratioBounds &&
                        compareId !== result.id &&
                        (ratio ? (
                          <Scaler
                            value={ratio}
                            bounds={{
                              highest: Math.max(
                                ratioBounds.highest,
                                -ratioBounds.lowest,
                              ),
                              lowest: Math.min(
                                ratioBounds.lowest,
                                -ratioBounds.highest,
                              ),
                            }}
                            type="stat"
                            reverse
                          >
                            {`${numFormatter.format(Math.abs(ratio))}x ${ratio < 0 ? "faster" : "slower"}`}
                            {/* than selected */}
                          </Scaler>
                        ) : (
                          <Scaler
                            value={0}
                            bounds={{ highest: 0, lowest: 0 }}
                            type="stat"
                          >
                            1x
                          </Scaler>
                        ))}
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
