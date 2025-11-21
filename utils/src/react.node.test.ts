import { describe, expect, it, vi } from "vitest";
import { mergeRefs } from "./react";

describe("mergeRefs", () => {
  it("should call all refs", () => {
    const refObject = { current: null };
    const refCallback = vi.fn();
    const merged = mergeRefs(refObject, refCallback);

    const value = "foo";
    merged(value);
    expect(refObject.current).toBe(value);
    expect(refCallback).toHaveBeenCalledWith(value);
  });
});
