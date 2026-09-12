// oxlint-disable jsx-a11y/control-has-associated-label
import type { TypesResult } from "@schema-benchmarks/bench";
import { getTransitionName, numFormatter, shortNumFormatter } from "@schema-benchmarks/utils";
import bem from "react-bem-helper";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count.tsx";
import { MatchCheckbox } from "#src/routes/typescript/-components/match.tsx";
import type { SortableKey } from "#src/routes/typescript/-constants.ts";
import { InternalLinkToggleButton } from "#src/shared/components/button/toggle.tsx";
import { MdSymbol } from "#src/shared/components/symbol/index.tsx";
import { Bar } from "#src/shared/components/table/bar.tsx";
import { SortableHeaderLink } from "#src/shared/components/table/sort.tsx";
import { useNumberFormatter } from "#src/shared/hooks/format/use-number-formatter.ts";
import type { SortDirection } from "#src/shared/lib/sort.ts";

export interface TypesTableProps {
  results: Array<TypesResult>;
  instantiationScaler: ReturnType<typeof Bar.getScale>;
  charsScaler: ReturnType<typeof Bar.getScale>;
  sortBy: SortableKey;
  sortDir: SortDirection;
}

const cls = bem("types-table");

const linkOptions = { from: "/typescript/", to: "/typescript" } as const;

export function TypesTable({
  results,
  instantiationScaler,
  charsScaler,
  ...sortState
}: TypesTableProps) {
  const formatCount = useNumberFormatter(numFormatter);
  const formatChars = useNumberFormatter(shortNumFormatter);
  return (
    <table {...cls()} aria-label="Results">
      <thead>
        <tr>
          <SortableHeaderLink
            {...SortableHeaderLink.getProps("libraryName", sortState, linkOptions)}
          >
            Library
          </SortableHeaderLink>
          <th>Version</th>
          <SortableHeaderLink
            {...SortableHeaderLink.getProps("downloads", sortState, linkOptions, "descending")}
            className="numeric"
            aria-label="Downloads per week"
          >
            <span {...cls("downloads-label")}>
              <MdSymbol size={18}>download</MdSymbol>/wk
            </span>
          </SortableHeaderLink>
          <th className="action">Input</th>
          <th className="action">Output</th>
          <SortableHeaderLink
            {...SortableHeaderLink.getProps("instantiations", sortState, linkOptions)}
            className="numeric"
            colSpan={2}
          >
            Instantiations
          </SortableHeaderLink>
          <SortableHeaderLink
            {...SortableHeaderLink.getProps("chars", sortState, linkOptions)}
            className="numeric"
            colSpan={2}
          >
            Type on hover
          </SortableHeaderLink>
          <th className="action"></th>
        </tr>
      </thead>
      <tbody>
        {results.map((result) => (
          <tr
            key={result.id}
            style={{
              viewTransitionName: getTransitionName("types-row", {
                libraryName: result.libraryName,
                note: result.note,
              }),
            }}
          >
            <td>
              <code className="language-text">{result.libraryName}</code>
              {result.note ? ` (${result.note})` : null}
            </td>
            <td>
              <code className="language-text">{result.version}</code>
            </td>
            <td className="numeric">
              <DownloadCount libraryName={result.libraryName} />
            </td>
            <td className="action">
              <MatchCheckbox match={result.input.match} />
            </td>
            <td className="action">
              <MatchCheckbox match={result.output.match} />
            </td>
            <td className="numeric">{formatCount(result.instantiations)}</td>
            <td className="fit-content">
              <Bar {...instantiationScaler(result.instantiations)} />
            </td>
            <td className="numeric">{formatChars(result.schema.chars)}</td>
            <td className="fit-content">
              <Bar {...charsScaler(result.schema.chars)} />
            </td>
            <td className="action">
              <InternalLinkToggleButton
                tooltip="Open details"
                {...linkOptions}
                search={(search) => ({ ...search, detail: result.id })}
                viewTransition={false}
              >
                <MdSymbol>data_object</MdSymbol>
              </InternalLinkToggleButton>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
