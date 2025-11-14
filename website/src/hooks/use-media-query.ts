import { useDebugValue, useMemo, useSyncExternalStore } from "react";

export function useMediaQuery(query: string, serverValue = false) {
  const mediaQuery = useMemo(() => {
    if (typeof window === "undefined") return null;
    return window.matchMedia(query);
  }, [query]);
  const matches = useSyncExternalStore(
    (onStoreChange) => {
      function onChange(e: MediaQueryListEvent) {
        console.log("Media query changed", e);
        onStoreChange();
      }
      mediaQuery?.addEventListener("change", onChange);
      return () => mediaQuery?.removeEventListener("change", onChange);
    },
    () => mediaQuery?.matches ?? serverValue,
    () => serverValue,
  );
  useDebugValue({ query, matches });
  return matches;
}
