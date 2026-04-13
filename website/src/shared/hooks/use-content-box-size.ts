import { useDebouncedState } from "@tanstack/react-pacer";
import { useEffect, useState } from "react";

export function useElementSize({ debounce = 0 }: { debounce?: number } = {}) {
  const [size, setSize, debouncer] = useDebouncedState<DOMRect | undefined>(undefined, {
    wait: debounce,
  });
  const [resizeObserver] = useState(() =>
    typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(([entry]) => {
          const domRect = entry?.target.getBoundingClientRect();
          setSize(domRect);
        }),
  );
  const [targetRef, setTargetRef] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (targetRef) {
      // set immediately
      debouncer.fn(targetRef.getBoundingClientRect());
      resizeObserver?.observe(targetRef);
      return () => resizeObserver?.unobserve(targetRef);
    }
  }, [resizeObserver, targetRef, debouncer]);
  return [size, setTargetRef] as const;
}
