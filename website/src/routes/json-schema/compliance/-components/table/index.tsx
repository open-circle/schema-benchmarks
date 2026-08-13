// oxlint-disable jsx-a11y/control-has-associated-label
import type { JsonComplianceResult } from "@schema-benchmarks/bench";
import { shortNumFormatter, percentFormatter, getTransitionName } from "@schema-benchmarks/utils";
import bem from "react-bem-helper";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count.tsx";
import { Snippet } from "#src/routes/_benchmarks/_runtime/-components/table/snippet.tsx";
import { JsonSchemaPackageButton } from "#src/routes/json-schema/-components/source.tsx";
import { jsonSourceProps } from "#src/routes/json-schema/_conversion/-constants.ts";
import { ensureComplianceTab } from "#src/routes/json-schema/compliance/-constants.tsx";
import type { SortableKey } from "#src/routes/json-schema/compliance/-constants.tsx";
import { processCount } from "#src/routes/json-schema/compliance/-constants.tsx";
import { InternalLinkToggleButton } from "#src/shared/components/button/toggle.tsx";
import { MdSymbol } from "#src/shared/components/symbol/index.tsx";
import { Pie } from "#src/shared/components/table/pie.tsx";
import { SortableHeaderLink } from "#src/shared/components/table/sort.tsx";
import { useNumberFormatter } from "#src/shared/hooks/format/use-number-formatter";
import type { SortDirection } from "#src/shared/lib/sort.ts";

export interface ComplianceTableProps {
  results: Array<JsonComplianceResult>;
  sortBy: SortableKey;
  sortDir: SortDirection;
}

const cls = bem("json-schema-table");

export function ComplianceTable({ results, ...sortState }: ComplianceTableProps) {
  const formatPercentage = useNumberFormatter(percentFormatter);
  const formatNumber = useNumberFormatter(shortNumFormatter);
  return (
    <table {...cls()} aria-label="Compliance Table">
      <thead>
        <tr>
          <SortableHeaderLink
            {...SortableHeaderLink.getProps("libraryName", sortState, {
              from: "/json-schema/compliance/$tab",
              to: "/json-schema/compliance/$tab",
              params: ({ tab }) => ({ tab: ensureComplianceTab(tab) }) as never,
            })}
          >
            Library
          </SortableHeaderLink>
          <th className="action"></th>
          <th>Version</th>
          <th>Source</th>
          <th className="action" aria-label="Source packages"></th>
          <SortableHeaderLink
            {...SortableHeaderLink.getProps(
              "downloads",
              sortState,
              {
                from: "/json-schema/compliance/$tab",
                to: "/json-schema/compliance/$tab",
                params: ({ tab }) => ({ tab: ensureComplianceTab(tab) }) as never,
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
                from: "/json-schema/compliance/$tab",
                to: "/json-schema/compliance/$tab",
                params: ({ tab }) => ({ tab: ensureComplianceTab(tab) }) as never,
              },
              "descending",
            )}
            className="numeric"
            colSpan={2}
          >
            Compliance
          </SortableHeaderLink>
          <th className="action" aria-label="Details"></th>
        </tr>
      </thead>
      <tbody>
        {results.map((result) => {
          const { passed, total, pct } = processCount(result.results.count);
          const sourceType = typeof result.source === "string" ? result.source : result.source.type;
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
              <td>{jsonSourceProps.labels[sourceType].label}</td>
              <td className="action">
                {typeof result.source === "object" && (
                  <JsonSchemaPackageButton {...result.source} />
                )}
              </td>
              <td className="numeric">
                <DownloadCount libraryName={result.libraryName} />
              </td>
              <td className="numeric">
                {formatPercentage(pct)} ({formatNumber(passed)} / {formatNumber(total)})
              </td>
              <td className="fit-content">
                <Pie value={pct} max={1} />
              </td>
              <td className="action">
                <InternalLinkToggleButton
                  tooltip="Open details"
                  from="/json-schema/compliance/$tab"
                  to="/json-schema/compliance/$tab"
                  params={({ tab }) => ({ tab: ensureComplianceTab(tab) })}
                  search={(search) => ({ ...search, detail: result.id })}
                  viewTransition={false}
                  {...cls("details-button")}
                >
                  <MdSymbol>checklist</MdSymbol>
                </InternalLinkToggleButton>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
