import type { JsonComplianceResult } from "@schema-benchmarks/bench";
import { percentFormatter, shortNumFormatter } from "@schema-benchmarks/utils";
import bem from "react-bem-helper";

import { DownloadCount } from "#src/routes/_benchmarks/-components/count.tsx";
import {
  ensureComplianceTab,
  processCount,
} from "#src/routes/json-schema/compliance/-constants.tsx";
import {
  List,
  ListItem,
  ListItemContent,
  ListItemInternalLink,
} from "#src/shared/components/list/index.tsx";
import { MdSymbol } from "#src/shared/components/symbol/index.tsx";
import { Pie } from "#src/shared/components/table/pie.tsx";
import { useNumberFormatter } from "#src/shared/hooks/format/use-number-formatter.ts";

export interface ComplianceListProps {
  results: Array<JsonComplianceResult>;
}

const cls = bem("json-schema-compliance-list");

export function ComplianceList({ results }: ComplianceListProps) {
  const formatNumber = useNumberFormatter(shortNumFormatter);
  const formatPercentage = useNumberFormatter(percentFormatter);
  return (
    <List aria-label="Compliance list" {...cls()}>
      {results.map((result) => {
        const { passed, total, pct } = processCount(result.results.count);
        return (
          <ListItem key={result.id}>
            <ListItemInternalLink
              from="/json-schema/compliance/$tab"
              to="/json-schema/compliance/$tab"
              params={({ tab }) => ({ tab: ensureComplianceTab(tab) })}
              search={(search) => ({ ...search, detail: result.id })}
              viewTransition={false}
            >
              <ListItemContent
                lines={3}
                leading={<Pie value={pct} max={1} />}
                overline={<code className="language-text">{result.version}</code>}
                primary={
                  <>
                    <code className="language-text">{result.libraryName}</code>
                    {result.note ? ` (${result.note})` : null}
                  </>
                }
                supporting={`${formatPercentage(pct)} (${formatNumber(passed)} / ${formatNumber(total)})`}
                trailing={
                  <div {...cls({ element: "downloads", extra: "typo-caption" })}>
                    <MdSymbol>download</MdSymbol>
                    <DownloadCount libraryName={result.libraryName} useLink={false} />
                  </div>
                }
              />
            </ListItemInternalLink>
          </ListItem>
        );
      })}
    </List>
  );
}
