import type { BenchResult } from "@schema-benchmarks/bench";
import {
  durationFormatter,
  getDuration,
  numFormatter,
} from "@schema-benchmarks/utils";
import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { Radio } from "@/components/radio";
import { Scaler } from "@/components/scaler";
import { MdSymbol } from "@/components/symbol";
import { Bar } from "@/components/table/bar";
import { errorTypeProps, optimizeTypeProps } from "../../query";
import { Snippet } from "./snippet";

// DistributiveArray<string | number> = Array<string> | Array<number>
type DistributiveArray<T> = T extends T ? Array<T> : never;

export interface BenchTableProps {
  results: DistributiveArray<BenchResult>;
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
    return Scaler.getScale([min, max, -min, -max], {
      type: "stat",
      lowerBetter: true,
    });
  }, [results, compareResult]);
  return { compareId, setCompareId, compareResult, ratioScaler };
}

export function BenchTable({ results }: BenchTableProps) {
  const meanScaler = useMemo(
    () =>
      Bar.getScale(
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
        icon={<MdSymbol>database_off</MdSymbol>}
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
            <th>Library</th>
            <th className="action"></th>
            <th>Version</th>
            <th>Optimizations</th>
            {results[0]?.type === "parsing" && <th>Error type</th>}
            <th className="numeric">Mean</th>
            {showComparisonColumns && (
              <>
                <th className="bar-after"></th>
                <th className="fit-content action">Compare</th>
                <th className="numeric"></th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {results.map((result) => {
            const ratio =
              compareResult && getRatio(result.mean, compareResult.mean);
            return (
              <tr
                key={result.id}
                style={{
                  viewTransitionName: `bench-table-row-${result.id}`,
                  backgroundColor: "var(--card-surface)",
                }}
              >
                <td>
                  <code className="language-text">{result.libraryName}</code>
                  {result.note ? ` (${result.note})` : null}
                </td>
                <td className="action">
                  <Snippet code={result.snippet} />
                </td>
                <td>
                  <code className="language-text">{result.version}</code>
                </td>
                <td>{optimizeTypeProps.labels[result.optimizeType].label}</td>
                {result.type === "parsing" && (
                  <td>{errorTypeProps.labels[result.errorType].label}</td>
                )}
                <td className="numeric">
                  {durationFormatter.format(getDuration(result.mean))}
                </td>
                {showComparisonColumns && (
                  <td className="bar-after">
                    <Bar {...meanScaler(result.mean)} />
                  </td>
                )}
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
                    <td className="numeric">
                      {compareResult &&
                        ratioScaler &&
                        compareId !== result.id &&
                        (ratio ? (
                          <Scaler
                            {...ratioScaler(ratio)}
                            symbolLabel={`${ratio > 0 ? "Slower" : "Faster"} than ${compareResult.libraryName}${compareResult.note ? ` (${compareResult.note})` : ""}`}
                          >
                            {`${numFormatter.format(Math.abs(ratio))}x`}
                          </Scaler>
                        ) : (
                          <Scaler
                            icon={<MdSymbol>stat_0</MdSymbol>}
                            color="var(--yellow)"
                            symbolLabel="Equal"
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
