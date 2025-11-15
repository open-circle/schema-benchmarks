import type { BenchResult } from "@schema-benchmarks/bench";
import { msToNs, numFormatter } from "@schema-benchmarks/utils";
import { useEffect, useMemo, useState } from "react";
import { CodeBlock } from "@/components/code";
import { EmptyState } from "@/components/empty-state";
import { Radio } from "@/components/radio";
import { getScaler, Scaler } from "@/components/scaler";

export interface BenchTableProps {
  results: Array<BenchResult>;
}

const getRatio = (a: number, b: number) => {
  if (a === b) return 0;
  if (a < b) return -(b / a);
  return a / b;
};

function useComparison(results: Array<BenchResult>) {
  const [compareId, setCompareId] = useState(results[0]?.id);
  useEffect(() => {
    setCompareId(results[0]?.id);
  }, [results]);
  const resultsById = useMemo(() => {
    return Object.fromEntries(results.map((result) => [result.id, result]));
  }, [results]);
  const compareResult = compareId && resultsById[compareId];
  const ratioScaler = useMemo(() => {
    if (!compareResult) return undefined;
    const ratios = results.map((result) =>
      getRatio(result.mean, compareResult.mean),
    );
    const max = Math.max(...ratios);
    const min = Math.min(...ratios);
    return getScaler([min, max, -min, -max], {
      type: "stat",
      lowerBetter: true,
    });
  }, [results, compareResult]);
  return { compareId, setCompareId, compareResult, ratioScaler };
}

export function BenchTable({ results }: BenchTableProps) {
  const meanBounds = useMemo(
    () =>
      getScaler(
        results.map((result) => result.mean),
        { lowerBetter: true },
      ),
    [results],
  );
  const { compareId, setCompareId, compareResult, ratioScaler } =
    useComparison(results);
  if (!results.length) {
    return (
      <EmptyState
        icon="database_off"
        title="No results found"
        subtitle="Try a different combination of filters"
      />
    );
  }
  const showComparisonColumns = results.length > 1;
  return (
    <div className="card">
      <table className="bench-table">
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
                  <Scaler {...meanBounds(result.mean)}>
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
                        ratioScaler &&
                        compareId !== result.id &&
                        (ratio ? (
                          <Scaler {...ratioScaler(ratio)}>
                            {`${numFormatter.format(Math.abs(ratio))}x ${ratio < 0 ? "faster" : "slower"}`}
                            {/* than selected */}
                          </Scaler>
                        ) : (
                          <Scaler icon="stat_0" color="var(--yellow)">
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
