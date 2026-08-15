import type { Ref, RefCallback } from "react";

export const mergeRefs =
  <T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> =>
  (value) => {
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
