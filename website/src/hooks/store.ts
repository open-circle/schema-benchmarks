import { useSyncExternalStore } from "react";

export type EqualityFn<T> = (a: T, b: T) => boolean;

const strictEquality: EqualityFn<unknown> = (a, b) => a === b;

// biome-ignore lint/complexity/noBannedTypes: necessary
const isFunction = (value: unknown): value is Function =>
  typeof value === "function";

export class ExternalStore<T> extends EventTarget {
  constructor(
    protected initialState: T,
    protected isEqual: EqualityFn<T> = strictEquality,
    public state: T = initialState,
  ) {
    super();
  }
  protected setState(setter: T | ((state: T) => T)) {
    const state = isFunction(setter) ? setter(this.state) : setter;
    if (!this.isEqual(this.state, state)) {
      this.state = state;
      this.dispatchEvent(new Event("change"));
    }
  }
  reset() {
    this.setState(this.initialState);
  }
  subscribe(callback: () => void) {
    this.addEventListener("change", callback);
    return () => this.removeEventListener("change", callback);
  }
}

export function useExternalStore<T, TSelected = T>(
  store: ExternalStore<T>,
  selector: (state: T) => TSelected,
  serverSelector = selector,
) {
  return useSyncExternalStore(
    (onStoreChange) => store.subscribe(onStoreChange),
    () => selector(store.state),
    () => serverSelector(store.state),
  );
}
