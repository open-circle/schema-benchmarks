import { makeDisposable } from "@schema-benchmarks/utils";
import type { Observer, StoreActionMap } from "@tanstack/react-store";
import { ReadonlyStore, Store } from "@tanstack/react-store";
import { create, type Draft } from "mutative";

type MutativeStoreActionsFactory<T, TActions extends StoreActionMap> = (store: {
  setState: (updater: (prev: T) => T) => void;
  updateState: (updater: (state: Draft<T>) => void) => void;
  get: () => T;
}) => TActions;
type NonFunction<T> = T extends (...args: Array<any>) => any ? never : T;

class MutativeStore<T, TActions extends StoreActionMap = never> extends Store<T, TActions> {
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
export function createStore<T, TActions extends StoreActionMap>(
  initialValue: NonFunction<T>,
  actionsFactory: MutativeStoreActionsFactory<T, TActions>,
): MutativeStore<T, TActions>;
export function createStore<T>(
  valueOrFn: NonFunction<T> | ((prev?: NoInfer<T>) => T),
  actionsFactory?: MutativeStoreActionsFactory<T, any>,
) {
  if (typeof valueOrFn === "function") return new DisposableReadonlyStore(valueOrFn);
  if (actionsFactory)
    return new MutativeStore(valueOrFn, ({ get, setState }) =>
      actionsFactory({ get, setState, updateState: (updater) => setState(create(updater)) }),
    );
  return new MutativeStore(valueOrFn);
}
