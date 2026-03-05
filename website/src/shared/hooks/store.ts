import { ReadonlyStore, Store } from "@tanstack/react-store";
import { create, type Draft } from "mutative";

class MutativeStore<T> extends Store<T> {
  updateState(updater: (state: Draft<T>) => void) {
    this.setState(create(updater));
  }
}

export function createStore<T>(getValue: (prev?: NoInfer<T>) => T): ReadonlyStore<T>;
export function createStore<T>(initialState: T): MutativeStore<T>;
export function createStore<T>(valueOrFn: T | ((prev?: NoInfer<T>) => T)) {
  if (typeof valueOrFn === "function") return new ReadonlyStore(valueOrFn);
  return new MutativeStore(valueOrFn);
}
