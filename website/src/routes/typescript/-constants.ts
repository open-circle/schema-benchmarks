import type { TypeMatch } from "@schema-benchmarks/bench";

export const sortableKeys = ["libraryName", "downloads", "instantiations", "chars"] as const;
export type SortableKey = (typeof sortableKeys)[number];

/**
 * How the inferred type compares with the data the shared product schema describes. Only `exact`
 * is a pass: a type that accepts more than the schema does pushes the check to runtime, and one
 * that accepts less rejects values the schema allows.
 */
export const typeMatchLabels: Record<TypeMatch, { label: string; supporting: string }> = {
  exact: { label: "Exact", supporting: "The inferred type and the data type describe each other." },
  wider: {
    label: "Wider",
    supporting: "The inferred type allows values the data type doesn't, such as `unknown`.",
  },
  narrower: {
    label: "Narrower",
    supporting: "The inferred type rejects values the data type allows.",
  },
  any: { label: "Any", supporting: "The library infers `any`, so nothing is type checked." },
  mismatch: { label: "Mismatch", supporting: "The inferred type is not the data type." },
};
