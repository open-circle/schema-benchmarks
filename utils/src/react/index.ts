import type { Ref } from "react";

export const mergeRefs =
  <T>(...refs: Array<Ref<T> | undefined>) =>
  (value: T | null) => {
    const cleanups: Array<() => void> = [];
    for (const ref of refs) {
      if (typeof ref === "function") {
        const cleanup = ref(value);
        if (typeof cleanup === "function") {
          cleanups.push(cleanup);
        }
      } else if (ref) {
        ref.current = value;
      }
    }
    return () => {
      for (const cleanup of cleanups) {
        cleanup();
      }
    };
  };

export const mergeListeners =
  <TArgs extends ReadonlyArray<any>>(...listeners: Array<((...args: TArgs) => void) | undefined>) =>
  (...args: TArgs) => {
    for (const listener of listeners) {
      if (typeof listener === "function") {
        listener(...args);
      }
    }
  };
