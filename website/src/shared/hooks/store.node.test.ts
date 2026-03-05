import { ReadonlyStore, Store } from "@tanstack/react-store";
import { describe, expect, it } from "vitest";

import { createStore } from "./store";

describe("createStore", () => {
  it("should create a store", () => {
    const store = createStore(0);
    expect(store).toBeInstanceOf(Store);
  });
  it("should extend store with updateState method, allowing to mutate the state", () => {
    const store = createStore({ value: 0 });
    store.updateState((state) => {
      state.value++;
    });
    expect(store.state).toEqual({ value: 1 });
  });
  it("should create a readonly store if a function is passed", () => {
    const counterStore = createStore(1);
    const doubleStore = createStore(() => counterStore.state * 2);
    expect(doubleStore).toBeInstanceOf(ReadonlyStore);
    expect(doubleStore.state).toBe(2);
    counterStore.setState((n) => n + 1);
    expect(doubleStore.state).toBe(4);
  });
});
