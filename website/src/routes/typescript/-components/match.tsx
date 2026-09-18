import type { InferredDirection } from "@schema-benchmarks/bench";

import { typeMatchLabels } from "#src/routes/typescript/-constants.tsx";
import { Checkbox } from "#src/shared/components/checkbox/index.tsx";

export function MatchCheckbox({ match }: { match: InferredDirection["match"] }) {
  const { label, supporting } = typeMatchLabels[match];
  return <Checkbox checked={match === "exact"} readOnly tooltip={{ subhead: label, supporting }} />;
}
