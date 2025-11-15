import { useDebugValue, useMemo, useSyncExternalStore } from "react";

export function useMediaQuery(query: string, serverValue = false) {
  const mediaQuery = useMemo(() => {
    if (typeof window === "undefined") return null;
    return window.matchMedia(query);
  }, [query]);
  const matches = useSyncExternalStore(
    (onStoreChange) => {
      mediaQuery?.addEventListener("change", onStoreChange);
      return () => mediaQuery?.removeEventListener("change", onStoreChange);
    },
    () => mediaQuery?.matches ?? serverValue,
    () => serverValue,
  );
  useDebugValue({ query, matches });
  return matches;
}
