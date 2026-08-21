import { describe, expect, it } from "vitest";

import { applySort, toggleSort } from "./sort";

const groupFallback = (a: { group: number }, b: { group: number }) => a.group - b.group;
const constantFallback = () => 100;

describe("toggleSort", () => {
  it("uses the initial direction when selecting a new column", () => {
    const toggle = toggleSort<"name" | "size">("name", "descending");

    expect(toggle({ sortBy: "size", sortDir: "ascending" })).toEqual({
      sortBy: "name",
      sortDir: "descending",
    });
  });

  it("toggles the direction when selecting the active column", () => {
    const toggle = toggleSort("name");

    expect(toggle({ sortBy: "name", sortDir: "ascending" })).toEqual({
      sortBy: "name",
      sortDir: "descending",
    });
    expect(toggle({ sortBy: "name", sortDir: "descending" })).toEqual({
      sortBy: "name",
      sortDir: "ascending",
    });
  });
});

describe("applySort", () => {
  it("applies descending order to the primary comparator", () => {
    const compare = applySort<number>((a, b) => a - b, {
      sortDir: "descending",
    });

    expect(compare(1, 2)).toBeGreaterThan(0);
  });

  it("uses fallbacks only when the primary comparator ties", () => {
    const compare = applySort<{ group: number }>(() => 0, { fallbacks: [groupFallback] });

    expect(compare({ group: 1 }, { group: 2 })).toBe(-1);
  });

  it("keeps the primary result when it is non-zero", () => {
    const compare = applySort<number>(() => -1, { fallbacks: [constantFallback] });

    expect(compare(1, 2)).toBe(-1);
  });
});
