import { castDraft } from "mutative";

import { createStore } from "#/shared/hooks/store";

import type { ConfirmDialogProps } from ".";

interface InternalDescription {
  props: ConfirmDialogProps;
  id: string;
  closing?: boolean;
  resolvers: PromiseWithResolvers<string | undefined>;
}

class ConfirmPromise<T> implements PromiseLike<T> {
  #basePromise: Promise<T>;
  constructor(basePromise: Promise<T>) {
    // prevent unhandledrejection
    basePromise.catch(() => {});

    this.#basePromise = basePromise;
  }
  then<TResult1 = T, TResult2 = never>(
    onconfirm?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    ondeny?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
  ): ConfirmPromise<TResult1 | TResult2> {
    return new ConfirmPromise(this.#basePromise.then(onconfirm, ondeny));
  }
  otherwise<TResult>(
    ondeny?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
  ): ConfirmPromise<T | TResult> {
    return new ConfirmPromise(this.#basePromise.catch(ondeny));
  }
  finally(onfinally?: (() => void) | undefined | null): ConfirmPromise<T> {
    return new ConfirmPromise(this.#basePromise.finally(onfinally));
  }
}

export const store = createStore<Array<InternalDescription>>([]);

export function confirm(description: ConfirmDialogProps) {
  const id = crypto.randomUUID();
  const resolvers = Promise.withResolvers<string | undefined>();
  store.updateState((state) => {
    state.push({ props: castDraft(description), id, resolvers });
  });
  return new ConfirmPromise(resolvers.promise);
}

function _close(id: string) {
  store.updateState((state) => {
    const item = state.find((item) => item.id === id);
    if (!item) return;
    item.closing = true;
  });
  setTimeout(() => {
    store.updateState((state) => {
      const index = state.findIndex((item) => item.id === id);
      if (index === -1) return;
      state.splice(index, 1);
    });
  }, 75);
}

export function resolve(id: string, returnValue?: string) {
  const entry = store.state.find((item) => item.id === id);
  entry?.resolvers.resolve(returnValue);
  _close(id);
}

export function reject(id: string, reason?: unknown) {
  const entry = store.state.find((item) => item.id === id);
  entry?.resolvers.reject(reason);
  _close(id);
}
