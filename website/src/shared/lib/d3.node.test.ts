import { describe, expect, it } from "vitest";

import { combineScales, reverseIf } from "./d3";

describe("combineScales", () => {
  it("should create a combined scale", () => {
    const scales = combineScales({
      a: (x) => x,
      b: (x) => x.valueOf() * 2,
    });
    expect(scales(1)).toEqual({ a: 1, b: 2 });
  });
});

describe("reverseIf", () => {
  it("should reverse the array if the condition is true", () => {
    expect(reverseIf(true, [1, 2, 3])).toEqual([3, 2, 1]);
  });
  it("should not reverse the array if the condition is false", () => {
    expect(reverseIf(false, [1, 2, 3])).toEqual([1, 2, 3]);
  });
  it("should not mutate the array", () => {
    const array = [1, 2, 3];
    reverseIf(true, array);
    expect(array).toEqual([1, 2, 3]);
  });
});
