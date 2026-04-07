import type { RefCallback, RefObject } from "react";
import { describe, expect, it, vi } from "vitest";

import { mergeRefs } from "./index.ts";

describe("mergeRefs", () => {
  it("should call all refs", () => {
    const refObject: RefObject<string | null> = { current: null };
    const refCallback = vi.fn<RefCallback<string>>();
    const merged = mergeRefs(refObject, refCallback);

    const value = "foo";
    merged(value);
    expect(refObject.current).toBe(value);
    expect(refCallback).toHaveBeenCalledWith(value);
  });
});
