import { castDraft } from "mutative";
import { ExternalStore } from "@/shared/hooks/store";
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
  // biome-ignore lint/suspicious/noThenProperty: custom thenable
  then<TResult1 = T, TResult2 = never>(
    onconfirm?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    ondeny?: // biome-ignore lint/suspicious/noExplicitAny: matching Promise types
    ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
  ): ConfirmPromise<TResult1 | TResult2> {
    return new ConfirmPromise(this.#basePromise.then(onconfirm, ondeny));
  }
  otherwise<TResult>(
    ondeny?: // biome-ignore lint/suspicious/noExplicitAny: matching Promise types
    ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
  ): ConfirmPromise<T | TResult> {
    return new ConfirmPromise(this.#basePromise.catch(ondeny));
  }
  finally(onfinally?: (() => void) | undefined | null): ConfirmPromise<T> {
    return new ConfirmPromise(this.#basePromise.finally(onfinally));
  }
}

class ConfirmQueue extends ExternalStore<Array<InternalDescription>> {
  constructor() {
    super([]);
  }
  #close(id: string) {
    this.setState((queue) => {
      const item = queue.find((item) => item.id === id);
      if (!item) return;
      item.closing = true;
    });

    setTimeout(
      () =>
        this.setState((queue) => {
          const index = queue.findIndex((item) => item.id === id);
          if (index === -1) return;
          queue.splice(index, 1);
        }),
      75,
    );
  }
  add(props: ConfirmDialogProps) {
    const resolvers = Promise.withResolvers<string | undefined>();
    const id = crypto.randomUUID();

    this.setState((queue) => {
      queue.push({ props: castDraft(props), id, resolvers });
    });

    return new ConfirmPromise(resolvers.promise);
  }
  resolve(id: string, returnValue?: string) {
    const entry = this.state.find((item) => item.id === id);

    entry?.resolvers.resolve(returnValue);

    this.#close(id);
  }
  reject(id: string, reason?: unknown) {
    const entry = this.state.find((item) => item.id === id);

    entry?.resolvers.reject(reason);

    this.#close(id);
  }
}

export const confirmQueue = new ConfirmQueue();

export function confirm(description: ConfirmDialogProps) {
  return confirmQueue.add(description);
}
