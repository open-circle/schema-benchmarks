import type { RefCallback, RefObject } from "react";
import { describe, expect, it, vi } from "vitest";

import { mergeRefs } from "./index.ts";

describe("mergeRefs", () => {
  it("should call all refs", () => {
    const refObject: RefObject<string | null> = { current: null };
    const cleanupFn = vi.fn();
    const refCallback = vi.fn<RefCallback<string>>();
    const refWithCleanup = vi.fn<RefCallback<string>>(() => cleanupFn);
    const merged = mergeRefs(refObject, refCallback, refWithCleanup, null);

    const value = "foo";
    const cleanup = merged(value);
    expect(refObject.current).toBe(value);
    expect(refCallback).toHaveBeenCalledWith(value);
    expect(refWithCleanup).toHaveBeenCalledWith(value);
    cleanup();
    expect(cleanupFn).toHaveBeenCalled();
  });
});
