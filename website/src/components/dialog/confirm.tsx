import { type DistributiveOmit, mergeRefs } from "@schema-benchmarks/utils";
import { useRef, useSyncExternalStore } from "react";
import { AlertDialog, type AlertDialogProps } from "./alert";

export interface ConfirmDialogProps
  extends DistributiveOmit<
    AlertDialogProps,
    "onConfirm" | "onCancel" | "open"
  > {}

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

class ConfirmQueue extends EventTarget {
  #queue: Array<InternalDescription> = [];
  get current() {
    return this.#queue[0];
  }
  #setQueue(
    recipe: (queue: Array<InternalDescription>) => Array<InternalDescription>,
  ) {
    const nextQueue = recipe(this.#queue);
    if (nextQueue !== this.#queue) {
      this.#queue = nextQueue;
      this.dispatchEvent(new Event("change"));
    }
  }
  #close(id: string) {
    this.#setQueue((queue) => {
      const index = queue.findIndex((item) => item.id === id);
      if (index === -1) return queue;
      setTimeout(
        () =>
          this.#setQueue((queue) => {
            const index = queue.findIndex((item) => item.id === id);
            if (index === -1) return queue;
            return queue.slice(0, index).concat(queue.slice(index + 1));
          }),
        75,
      );
      return [
        ...queue.slice(0, index),
        // biome-ignore lint/style/noNonNullAssertion: we've checked that the item exists
        { ...queue[index]!, closing: true },
        ...queue.slice(index + 1),
      ];
    });
  }
  add(props: ConfirmDialogProps) {
    const resolvers = Promise.withResolvers<string | undefined>();
    const id = crypto.randomUUID();

    this.#setQueue((queue) => [
      ...queue,
      {
        props: props,
        id,
        resolvers,
      },
    ]);

    return new ConfirmPromise(resolvers.promise);
  }
  resolve(id: string, returnValue?: string) {
    this.#queue.find((item) => item.id === id)?.resolvers.resolve(returnValue);
    this.#close(id);
  }
  reject(id: string, reason?: unknown) {
    this.#queue.find((item) => item.id === id)?.resolvers.reject(reason);
    this.#close(id);
  }
  subscribe(callback: () => void) {
    this.addEventListener("change", callback);
    return () => this.removeEventListener("change", callback);
  }
}

const confirmQueue = new ConfirmQueue();

export function confirm(description: ConfirmDialogProps) {
  return confirmQueue.add(description);
}

export function ConfirmDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const current = useSyncExternalStore(
    (onStoreChange) => confirmQueue.subscribe(onStoreChange),
    () => confirmQueue.current,
    () => confirmQueue.current,
  );

  return (
    current && (
      <AlertDialog
        {...current.props}
        ref={mergeRefs(dialogRef, current.props.ref)}
        open={!current.closing}
        onConfirm={(close) => {
          confirmQueue.resolve(current.id, dialogRef.current?.returnValue);
          close();
        }}
        onCancel={() => {
          confirmQueue.reject(current.id);
        }}
      />
    )
  );
}
