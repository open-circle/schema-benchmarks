import type { RefCallback, RefObject } from "react";
import { describe, expect, it, vi } from "vite-plus/test";

import { mergeRefs, mergeListeners } from "./index.ts";

describe("mergeRefs", () => {
  it("should call all refs", () => {
    const refObject: RefObject<string | null> = { current: null };
    const cleanupFn = vi.fn<() => void>();
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

describe("mergeListeners", () => {
  it("should call all listeners", () => {
    type Args = [string, number];
    const listener1 = vi.fn<(...args: Args) => void>();
    const listener2 = vi.fn<(...args: Args) => void>();
    const merged = mergeListeners(listener1, listener2, undefined);

    const args: Args = ["foo", 42];
    merged(...args);
    expect(listener1).toHaveBeenCalledWith(...args);
    expect(listener2).toHaveBeenCalledWith(...args);
  });
});
