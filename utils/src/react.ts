import type { Ref } from "react";

export const mergeRefs = <T extends HTMLElement>(
  ...refs: Array<Ref<T> | undefined>
) => {
  return (value: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref) {
        ref.current = value;
      }
    }
  };
};
