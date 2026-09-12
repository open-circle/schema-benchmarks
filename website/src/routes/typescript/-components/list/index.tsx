import type { TypesResult } from "@schema-benchmarks/bench";
import { getTransitionName, numFormatter } from "@schema-benchmarks/utils";
import bem from "react-bem-helper";

import { MatchCheckbox } from "#src/routes/typescript/-components/match.tsx";
import { List, ListItem, ListItemContent, ListItemInternalLink } from "#src/shared/components/list";
import { Bar } from "#src/shared/components/table/bar.tsx";
import { useNumberFormatter } from "#src/shared/hooks/format/use-number-formatter.ts";

export interface TypesListProps {
  results: Array<TypesResult>;
  instantiationScaler: ReturnType<typeof Bar.getScale>;
}

const cls = bem("types-list");

export function TypesList({ results, instantiationScaler }: TypesListProps) {
  const formatCount = useNumberFormatter(numFormatter);
  return (
    <List aria-label="Results" {...cls()}>
      {results.map((result) => {
        const id = getTransitionName("types-list-item", {
          libraryName: result.libraryName,
          note: result.note,
        });
        return (
          <ListItem key={result.id} id={id} style={{ viewTransitionName: id }}>
            <ListItemInternalLink
              from="/typescript/"
              to="/typescript"
              search={(search) => ({ ...search, detail: result.id })}
              viewTransition={false}
            >
              <ListItemContent
                lines={3}
                overline={<code className="language-text">{result.version}</code>}
                primary={
                  <>
                    <code className="language-text">{result.libraryName}</code>
                    {result.note ? ` (${result.note})` : null}
                  </>
                }
                supporting={`${formatCount(result.instantiations)} instantiations, ${formatCount(result.schema.chars)} characters on hover`}
                trailing={
                  <span {...cls("matches")}>
                    <MatchCheckbox match={result.input.match} />
                    <MatchCheckbox match={result.output.match} />
                  </span>
                }
              />
            </ListItemInternalLink>
            <span {...cls("bar")}>
              <Bar {...instantiationScaler(result.instantiations)} />
            </span>
          </ListItem>
        );
      })}
    </List>
  );
}
