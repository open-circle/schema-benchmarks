import type { FromTypeResult } from "@schema-benchmarks/bench";
import { describe, expect, it } from "vitest";

import { fromTypeVerdict, missedFromTypeCases } from "./-constants.ts";

const fromType = (cases: Partial<FromTypeResult["cases"]>): FromTypeResult => ({
  style: "annotation",
  snippet: "",
  cases: {
    wrongType: true,
    missingField: true,
    optionalField: true,
    extraField: true,
    ...cases,
  },
});

describe("fromTypeVerdict", () => {
  it("is exact when every disagreement is rejected", () => {
    expect(fromTypeVerdict(fromType({}))).toBe("exact");
  });

  it("is exact for a schema generated from the type", () => {
    expect(fromTypeVerdict({ ...fromType({}), derived: true })).toBe("exact");
  });

  it("is unsafe when a schema the type never described is accepted", () => {
    expect(fromTypeVerdict(fromType({ optionalField: false }))).toBe("unsafe");
    expect(fromTypeVerdict(fromType({ extraField: false }))).toBe("unsafe");
  });

  it("is unsafe even when nothing at all is rejected", () => {
    expect(
      fromTypeVerdict(
        fromType({
          wrongType: false,
          missingField: false,
          optionalField: false,
          extraField: false,
        }),
      ),
    ).toBe("unsafe");
  });

  it("is no when the library cannot build a schema from a type", () => {
    expect(fromTypeVerdict(undefined)).toBe("no");
  });

  it("names the disagreements a library lets through", () => {
    expect(missedFromTypeCases(fromType({ optionalField: false, extraField: false }))).toEqual([
      "optionalField",
      "extraField",
    ]);
  });
});
