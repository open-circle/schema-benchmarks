import type { TypesResult } from "@schema-benchmarks/bench";
import { describe, expect, it } from "vitest";

import { compareResults } from "./-sort.ts";

const result = (id: string, instantiations?: number): TypesResult => ({
  id,
  libraryName: id,
  version: "1.0.0",
  ...(instantiations === undefined
    ? { noInference: "the inferred type cannot be named" }
    : {
        inference: {
          schema: { text: "", chars: instantiations, instantiations },
          input: { text: "", chars: 0, instantiations, snippet: "", match: "exact" },
          output: { text: "", chars: 0, instantiations, snippet: "", match: "exact" },
          instantiations,
        },
      }),
});

const results = [result("slow", 2), result("none"), result("fast", 1)];

const sortedIds = (
  sortBy: "instantiations" | "chars" | "libraryName",
  sortDir: "ascending" | "descending",
) => results.toSorted(compareResults({ sortBy, sortDir }, {})).map((each) => each.id);

describe("compareResults", () => {
  it("sorts by the number, cheapest first", () => {
    expect(sortedIds("instantiations", "ascending")).toEqual(["fast", "slow", "none"]);
  });

  it("keeps a library that infers nothing last when the sort is reversed", () => {
    expect(sortedIds("instantiations", "descending")).toEqual(["slow", "fast", "none"]);
    expect(sortedIds("chars", "descending")).toEqual(["slow", "fast", "none"]);
  });

  it("sorts a library that infers nothing by name like any other", () => {
    expect(sortedIds("libraryName", "ascending")).toEqual(["fast", "none", "slow"]);
    expect(sortedIds("libraryName", "descending")).toEqual(["slow", "none", "fast"]);
  });
});
