// oxlint-disable jsx-a11y/control-has-associated-label
import type { JsonSchemaResult } from "@schema-benchmarks/bench";
import { formatDuration, getTransitionName, numFormatter } from "@schema-benchmarks/utils";
import { useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count";
import { Snippet } from "#src/routes/_benchmarks/_runtime/-components/table/snippet";
import type { SortableKey } from "#src/routes/_benchmarks/_runtime/-constants";
import { GeneratedJsonSchema } from "#src/routes/_benchmarks/json-schema/conversion/-components/json-schema";
import {
  jsonSchemaDirectionProps,
  jsonSchemaSourceProps,
  standardJsonSchemaProps,
  jsonSchemaTargetProps,
} from "#src/routes/_benchmarks/json-schema/conversion/-constants.ts";
import { ToggleButton } from "#src/shared/components/button/toggle";
import { Radio } from "#src/shared/components/radio";
import { Scaler } from "#src/shared/components/scaler";
import { MdSymbol } from "#src/shared/components/symbol";
import { Bar } from "#src/shared/components/table/bar";
import { SortableHeaderLink } from "#src/shared/components/table/sort";
import { useNumberFormatter } from "#src/shared/hooks/format/use-number-formatter";
import type { SortDirection } from "#src/shared/lib/sort";

export interface JsonSchemaBenchTableProps {
  results: Array<JsonSchemaResult>;
  meanScaler: ReturnType<typeof Bar.getScale>;
  to: "/json-schema/conversion";
  sortBy: SortableKey;
  sortDir: SortDirection;
}

const getRatio = (a: number, b: number) => {
  // constants aren't timed, so there's no ratio to show against them
  if (!a || !b) return a === b ? 0 : undefined;
  if (a === b) return 0;
  if (a < b) return -(b / a);
  return a / b;
};

/** The first row that was actually timed - comparing everything against a constant says nothing. */
const getDefaultCompareId = (results: Array<JsonSchemaResult>) =>
  (results.find((result) => result.mean) ?? results[0])?.id;

function useComparison(results: Array<JsonSchemaResult>) {
  const [compareId, setCompareId] = useState(() => getDefaultCompareId(results));
  useEffect(() => {
    setCompareId(getDefaultCompareId(results));
  }, [results]);
  const resultsById = useMemo(() => {
    return Object.fromEntries(results.map((result) => [result.id, result]));
  }, [results]);
  const compareResult = compareId && resultsById[compareId];
  const ratioScaler = useMemo(() => {
    if (!compareResult) return undefined;
    const ratios = results
      .map((result) => getRatio(result.mean, compareResult.mean))
      .filter((ratio) => ratio !== undefined);
    const max = Math.max(...ratios);
    const min = Math.min(...ratios);
    return Scaler.getScale([min, max, -min, -max], {
      type: "stat",
      lowerBetter: true,
    });
  }, [results, compareResult]);
  return { compareId, setCompareId, compareResult, ratioScaler };
}

export function JsonSchemaTable({
  results,
  meanScaler,
  to,
  ...sortState
}: JsonSchemaBenchTableProps) {
  const { compareId, setCompareId, compareResult, ratioScaler } = useComparison(results);
  const formatNumber = useNumberFormatter(numFormatter);
  const showComparisonColumns = results.length > 1;
  return (
    <table
      className="json-schema-table"
      aria-label="Results"
      style={{ viewTransitionName: "result-table" }}
    >
      <thead>
        <tr>
          <SortableHeaderLink {...SortableHeaderLink.getProps("libraryName", sortState, { to })}>
            Library
          </SortableHeaderLink>
          <th className="action"></th>
          <th className="action"></th>
          <th className="action"></th>
          <th>Version</th>
          <SortableHeaderLink
            {...SortableHeaderLink.getProps("downloads", sortState, { to }, "descending")}
            className="numeric"
            aria-label="Downloads per week"
          >
            <span className="json-schema-table__downloads-label">
              <MdSymbol size={18}>download</MdSymbol>/wk
            </span>
          </SortableHeaderLink>
          <th>Source</th>
          <th>Standard JSON Schema</th>
          <th>Target</th>
          <th>Type</th>
          <SortableHeaderLink
            {...SortableHeaderLink.getProps("mean", sortState, { to })}
            className="numeric"
          >
            Mean
          </SortableHeaderLink>
          {showComparisonColumns && (
            <>
              <th className="bar-after"></th>
              <th className="fit-content action" colSpan={2}>
                Compare
              </th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {results.map((result) => {
          const ratio = compareResult && getRatio(result.mean, compareResult.mean);
          return (
            <tr
              key={result.id}
              style={{
                viewTransitionName: getTransitionName("json-schema-table-row", {
                  libraryName: result.libraryName,
                  note: result.note,
                  direction: result.direction,
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
                <GeneratedJsonSchema jsonSchema={result.jsonSchema} />
              </td>
              <td className="action">
                {result.throws && (
                  <ToggleButton
                    tooltip={{
                      subhead: "Throws on invalid data",
                      supporting: (
                        <div style={{ maxWidth: "16rem" }}>
                          This library throws an error when parsing invalid data (and has no
                          non-throwing equivalent), so the benchmark includes a try/catch.
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
              <td>{jsonSchemaSourceProps.labels[result.source].label}</td>
              <td>{standardJsonSchemaProps.labels[result.standardJsonSchema].label}</td>
              <td>{jsonSchemaTargetProps.labels[result.target].label}</td>
              <td>{jsonSchemaDirectionProps.labels[result.direction].label}</td>
              <td className="numeric">{formatDuration(result.mean)}</td>
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
                        setCompareId(event.target.checked ? result.id : undefined);
                      }}
                    />
                  </td>
                  <td className="numeric bar-after">
                    {compareResult &&
                      ratioScaler &&
                      compareId !== result.id &&
                      (ratio === undefined ? (
                        <span aria-label="Not comparable">n/a</span>
                      ) : ratio ? (
                        <Scaler
                          {...ratioScaler(ratio)}
                          symbolLabel={`${ratio > 0 ? "Slower" : "Faster"} than ${compareResult.libraryName}${compareResult.note ? ` (${compareResult.note})` : ""}`}
                        >
                          <span aria-label={`${numFormatter.format(Math.abs(ratio))}x`}>
                            {`${formatNumber(Math.abs(ratio))}x`}
                          </span>
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
  );
}
