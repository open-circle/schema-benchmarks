import type { FromTypeResult } from "@schema-benchmarks/bench";
import { describe, expect, it } from "vitest";

import { missedFromTypeCases } from "./-constants.tsx";

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

describe("missedFromTypeCases", () => {
  it("names the disagreements a library lets through", () => {
    expect(missedFromTypeCases(fromType({ optionalField: false, extraField: false }))).toEqual([
      "optionalField",
      "extraField",
    ]);
  });
});
