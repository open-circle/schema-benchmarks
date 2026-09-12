import type { FromTypeResult, TypeMatch } from "@schema-benchmarks/bench";
import type { FromTypeCase, FromTypeStyle } from "@schema-benchmarks/schemas";
import { fromTypeCaseSchema } from "@schema-benchmarks/schemas";

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

/** How a library takes a type that already exists and checks a schema against it. */
export const fromTypeStyleLabels: Record<FromTypeStyle, { label: string }> = {
  builder: { label: "Builder" },
  annotation: { label: "Annotation" },
};

/** The ways a schema can disagree with the type it was built for. */
export const fromTypeCaseLabels: Record<FromTypeCase, { label: string; supporting: string }> = {
  wrongType: { label: "Wrong type", supporting: "a field of the wrong type" },
  missingField: { label: "Missing field", supporting: "a field of the type left out" },
  optionalField: {
    label: "Optional field",
    supporting: "a field required where the type makes it optional",
  },
  extraField: { label: "Extra field", supporting: "a field the type doesn't declare" },
};

/** The ways a schema built from a type can disagree with it, that a library lets through. */
export const missedFromTypeCases = (fromType: FromTypeResult) =>
  fromTypeCaseSchema.options.filter((name) => !fromType.cases[name]);

/**
 * What a library rejects matters more than whether it has the API at all: one that checks only
 * assignability takes a schema requiring a field the type makes optional, and that schema then
 * rejects data the type calls valid. A schema generated from the type cannot disagree with it, so
 * it is exact by construction.
 */
export const fromTypeVerdict = (fromType: FromTypeResult | undefined) => {
  if (!fromType) return "no";
  return missedFromTypeCases(fromType).length ? "unsafe" : "exact";
};

export const fromTypeVerdictLabels: Record<ReturnType<typeof fromTypeVerdict>, string> = {
  exact: "Exact",
  unsafe: "Unsafe",
  no: "No",
};
