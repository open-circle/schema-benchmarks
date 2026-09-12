import type { InferredDirection } from "@schema-benchmarks/bench";
import { useRef } from "react";

import { typeMatchLabels } from "#src/routes/typescript/-constants.ts";
import { Checkbox } from "#src/shared/components/checkbox/index.tsx";

export function MatchCheckbox({ match }: { match: InferredDirection["match"] }) {
  const popoverRef = useRef<HTMLElement>(null);
  const { label, supporting } = typeMatchLabels[match];
  return (
    <Checkbox
      checked={match === "exact"}
      readOnly
      aria-label={label}
      tooltip={{ subhead: label, supporting }}
      popoverRef={popoverRef}
    />
  );
}
