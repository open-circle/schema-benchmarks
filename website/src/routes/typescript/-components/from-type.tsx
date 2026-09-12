import type { FromTypeResult } from "@schema-benchmarks/bench";
import { fromTypeCaseSchema } from "@schema-benchmarks/schemas";
import type { ComponentPropsWithRef } from "react";
import { useRef } from "react";

import {
  fromTypeCaseLabels,
  fromTypeStyleLabels,
  fromTypeVerdict,
  fromTypeVerdictLabels,
  missedFromTypeCases,
} from "#src/routes/typescript/-constants.ts";
import { List, ListItem, ListItemContent } from "#src/shared/components/list/index.tsx";
import { MdSymbol } from "#src/shared/components/symbol/index.tsx";
import { withTooltip } from "#src/shared/components/tooltip/index.tsx";

const VerdictText = withTooltip(function VerdictText(props: ComponentPropsWithRef<"span">) {
  return <span {...props} />;
});

export function FromTypeText({ fromType }: { fromType: FromTypeResult | undefined }) {
  const popoverRef = useRef<HTMLElement>(null);
  const label = fromTypeVerdictLabels[fromTypeVerdict(fromType)];
  if (!fromType) return label;
  const missed = missedFromTypeCases(fromType);
  return (
    <VerdictText
      tooltip={{
        subhead: `${fromTypeStyleLabels[fromType.style].label}${fromType.derived ? ", generated from the type" : ""}`,
        supporting: missed.length
          ? `Accepts a schema with ${missed.map((name) => fromTypeCaseLabels[name].supporting).join(", ")}.`
          : "Rejects every way a schema can disagree with the type.",
      }}
      popoverRef={popoverRef}
    >
      {label}
    </VerdictText>
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
            leading={
              // written out rather than picked, so the build sees both symbols and subsets them
              fromType.cases[name] ? <MdSymbol>check_circle</MdSymbol> : <MdSymbol>cancel</MdSymbol>
            }
            primary={fromTypeCaseLabels[name].label}
            supporting={`A schema with ${fromTypeCaseLabels[name].supporting} is ${fromType.cases[name] ? "rejected" : "accepted"}.`}
          />
        </ListItem>
      ))}
    </List>
  );
}
