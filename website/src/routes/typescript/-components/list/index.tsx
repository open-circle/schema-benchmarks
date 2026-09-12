import type { TypesResult } from "@schema-benchmarks/bench";
import { getTransitionName, numFormatter } from "@schema-benchmarks/utils";
import bem from "react-bem-helper";

import { FromTypeText } from "#src/routes/typescript/-components/from-type.tsx";
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
      {results.map(({ inference, ...result }) => {
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
                supporting={
                  inference
                    ? `${formatCount(inference.instantiations)} instantiations, ${formatCount(inference.schema.chars)} characters on hover`
                    : "Infers no type from a schema"
                }
                trailing={
                  <span {...cls("matches")}>
                    {inference && <MatchCheckbox match={inference.input.match} />}
                    {inference && <MatchCheckbox match={inference.output.match} />}
                    <FromTypeText fromType={result.fromType} />
                  </span>
                }
              />
            </ListItemInternalLink>
            {inference && (
              <span {...cls("bar")}>
                <Bar {...instantiationScaler(inference.instantiations)} />
              </span>
            )}
          </ListItem>
        );
      })}
    </List>
  );
}
