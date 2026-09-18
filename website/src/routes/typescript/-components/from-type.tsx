import type { FromTypeResult } from "@schema-benchmarks/bench";
import { fromTypeCaseSchema } from "@schema-benchmarks/schemas";

import {
  fromTypeCaseLabels,
  fromTypeStyleLabels,
  missedFromTypeCases,
} from "#src/routes/typescript/-constants.tsx";
import { Checkbox } from "#src/shared/components/checkbox/index.tsx";
import { List, ListItem, ListItemContent } from "#src/shared/components/list/index.tsx";

export function FromTypeText({ fromType }: { fromType: FromTypeResult | undefined }) {
  if (!fromType) return null;
  const missed = missedFromTypeCases(fromType);
  return (
    <Checkbox
      checked={!missed.length}
      readOnly
      tooltip={{
        subhead: `${fromTypeStyleLabels[fromType.style]}${fromType.derived ? ", generated from the type" : ""}`,
        supporting: missed.length ? (
          <>
            Accepts a schema with:
            <ul>
              {missed.map((name) => (
                <li key={name}>{fromTypeCaseLabels[name].supporting}</li>
              ))}
            </ul>
          </>
        ) : (
          "Rejects every way a schema can disagree with the type."
        ),
      }}
    />
  );
}

/** Each way a schema can disagree with its type, and whether the compiler caught it. */
export function FromTypeCases({ fromType }: { fromType: FromTypeResult }) {
  return (
    <List aria-label="Mistakes the compiler catches">
      {fromTypeCaseSchema.options.map((name) => (
        <ListItem key={name}>
          <ListItemContent
            lines={2}
            leading={<Checkbox checked={fromType.cases[name]} readOnly />}
            primary={fromTypeCaseLabels[name].label}
            supporting={`A schema with ${fromTypeCaseLabels[name].supporting} is ${fromType.cases[name] ? "rejected" : "accepted"}.`}
          />
        </ListItem>
      ))}
    </List>
  );
}
