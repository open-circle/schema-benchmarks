import { useDebouncedCallback } from "@tanstack/react-pacer";
import { useEffect, useState } from "react";

export function useElementSize({ debounce = 0 }: { debounce?: number } = {}) {
  const [size, setSize] = useState<DOMRect>();
  const setDebouncedSize = useDebouncedCallback(setSize, { wait: debounce });
  const [resizeObserver] = useState(
    () =>
      new ResizeObserver(([entry]) => {
        const domRect = entry?.target.getBoundingClientRect();
        setDebouncedSize(domRect);
      }),
  );
  const [targetRef, setTargetRef] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (targetRef) {
      setSize(targetRef.getBoundingClientRect());
      resizeObserver.observe(targetRef);
      return () => resizeObserver.unobserve(targetRef);
    }
  }, [resizeObserver, targetRef]);
  return [size, setTargetRef] as const;
}
