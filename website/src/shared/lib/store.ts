import { makeDisposable } from "@schema-benchmarks/utils";
import type { Observer } from "@tanstack/react-store";
import { ReadonlyStore, Store } from "@tanstack/react-store";
import { create, type Draft } from "mutative";

class MutativeStore<T> extends Store<T> {
  updateState(updater: (state: Draft<T>) => void) {
    this.setState(create(updater));
  }
  override subscribe(observerOrFn: Observer<T> | ((value: T) => void)) {
    return makeDisposable(super.subscribe(observerOrFn));
  }
}

class DisposableReadonlyStore<T> extends ReadonlyStore<T> {
  override subscribe(observerOrFn: Observer<T> | ((value: T) => void)) {
    return makeDisposable(super.subscribe(observerOrFn));
  }
}

export function createStore<T>(getValue: (prev?: NoInfer<T>) => T): DisposableReadonlyStore<T>;
export function createStore<T>(initialState: T): MutativeStore<T>;
export function createStore<T>(valueOrFn: T | ((prev?: NoInfer<T>) => T)) {
  if (typeof valueOrFn === "function") return new DisposableReadonlyStore(valueOrFn);
  return new MutativeStore(valueOrFn);
}
