// oxlint-disable jsx-a11y/control-has-associated-label
import type { JsonComplianceResult } from "@schema-benchmarks/bench";
import { shortNumFormatter, percentFormatter, getTransitionName } from "@schema-benchmarks/utils";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count.tsx";
import { Snippet } from "#src/routes/_benchmarks/_runtime/-components/table/snippet.tsx";
import type { SortableKey } from "#src/routes/json-schema/compliance/-constants.tsx";
import { getPctCompliance } from "#src/routes/json-schema/compliance/-constants.tsx";
import { MdSymbol } from "#src/shared/components/symbol/index.tsx";
import { Pie } from "#src/shared/components/table/pie.tsx";
import { SortableHeaderLink } from "#src/shared/components/table/sort.tsx";
import { useNumberFormatter } from "#src/shared/hooks/format/use-number-formatter";
import type { SortDirection } from "#src/shared/lib/sort.ts";

export interface ComplianceTableProps {
  results: Array<JsonComplianceResult>;
  pieScale: ReturnType<typeof Pie.getScale>;
  sortBy: SortableKey;
  sortDir: SortDirection;
}

export function ComplianceTable({ results, pieScale, ...sortState }: ComplianceTableProps) {
  const formatPercentage = useNumberFormatter(percentFormatter);
  const formatNumber = useNumberFormatter(shortNumFormatter);
  return (
    <table className="json-schema-table" aria-label="Compliance Table">
      <thead>
        <tr>
          <SortableHeaderLink
            {...SortableHeaderLink.getProps("libraryName", sortState, {
              to: "/json-schema/compliance",
            })}
          >
            Library
          </SortableHeaderLink>
          <th className="action"></th>
          <th>Version</th>
          <SortableHeaderLink
            {...SortableHeaderLink.getProps(
              "downloads",
              sortState,
              {
                to: "/json-schema/compliance",
              },
              "descending",
            )}
            className="numeric"
            aria-label="Downloads per week"
          >
            <span className="json-schema-table__downloads-label">
              <MdSymbol size={18}>download</MdSymbol>/wk
            </span>
          </SortableHeaderLink>
          <SortableHeaderLink
            {...SortableHeaderLink.getProps(
              "compliance",
              sortState,
              {
                to: "/json-schema/compliance",
              },
              "descending",
            )}
            className="numeric"
            colSpan={2}
          >
            Compliance
          </SortableHeaderLink>
        </tr>
      </thead>
      <tbody>
        {results.map((result) => {
          const { passed, failed } = result.results.count;
          const total = passed + failed;
          const percentage = getPctCompliance(result);
          return (
            <tr
              key={result.id}
              style={{
                viewTransitionName: getTransitionName("compliance-row", {
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
                <Snippet code={result.snippet} />
              </td>
              <td>
                <code className="language-text">{result.version}</code>
              </td>
              <td className="numeric">
                <DownloadCount libraryName={result.libraryName} />
              </td>
              <td className="numeric">
                {formatPercentage(percentage)} ({formatNumber(passed)} / {formatNumber(total)})
              </td>
              <th className="action">
                <Pie {...pieScale(percentage)} />
              </th>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
