import { describe, expect } from "vitest";
import { renderHook } from "vitest-browser-react";

import { it } from "#test/browser/fixtures";

import { ExternalStore, useExternalStore } from "./store";

describe("ExternalStore", () => {
  it("should update the state", async () => {
    const store = new ExternalStore(0);
    const { result } = await renderHook(() => useExternalStore(store, (state) => state));
    expect(result.current).toBe(0);
    store.setState(1);
    await expect.ref(result).toBe(1);
  });
  it("should reset the state", async () => {
    const store = new ExternalStore(0);
    const { result } = await renderHook(() => useExternalStore(store, (state) => state));
    expect(result.current).toBe(0);
    store.setState(1);
    await expect.ref(result).toBe(1);
    store.reset();
    await expect.ref(result).toBe(0);
  });
  it("supports selecting part of the state", async () => {
    const store = new ExternalStore({ count: 0 });
    const { result } = await renderHook(() => useExternalStore(store, (state) => state.count));
    expect(result.current).toBe(0);
    store.setState({ count: 1 });
    await expect.ref(result).toBe(1);
  });
});
