import type { BenchResult } from "@schema-benchmarks/bench";
import {
  type DistributiveArray,
  durationFormatter,
  getDuration,
  getTransitionName,
  numFormatter,
} from "@schema-benchmarks/utils";
import { useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ToggleButton } from "@/components/button/toggle";
import { EmptyState } from "@/components/empty-state";
import { Radio } from "@/components/radio";
import { Scaler } from "@/components/scaler";
import { MdSymbol } from "@/components/symbol";
import { Bar } from "@/components/table/bar";
import { DownloadCount } from "@/features/popularity/components/count";
import { errorTypeProps, optimizeTypeProps } from "../../constants";
import { Snippet } from "./snippet";

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
  // biome-ignore lint/style/noNonNullAssertion: We know there's at least one result
  const benchType = results[0]!.type;
  return (
    <div className="card" style={{ viewTransitionName: "bench-table" }}>
      <table className="bench-table">
        <thead>
          <tr>
            <th>Library</th>
            <th className="action"></th>
            <th className="action"></th>
            <th>Version</th>
            <th className="numeric">Downloads (weekly)</th>
            <th>Optimizations</th>
            {benchType === "parsing" && <th>Error type</th>}
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
                  viewTransitionName: getTransitionName("bench-table-row", {
                    libraryName: result.libraryName,
                    note: result.note,
                    errorType:
                      result.type === "parsing" ? result.errorType : undefined,
                  }),
                }}
              >
                <td>
                  <code className="language-text">{result.libraryName}</code>
                  {result.note ? ` (${result.note})` : null}
                </td>
                <td className="action">
                  <Snippet code={result.snippet} />
                </td>
                <td className="action">
                  {result.throws && (
                    <ToggleButton
                      tooltip={{
                        subhead: "Throws on invalid data",
                        supporting: (
                          <div style={{ maxWidth: "16rem" }}>
                            This library throws an error when parsing invalid
                            data (and has no non-throwing equivalent), so the
                            benchmark includes a try/catch.
                          </div>
                        ),
                      }}
                    >
                      <MdSymbol>error</MdSymbol>
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
