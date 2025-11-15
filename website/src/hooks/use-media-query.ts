import { isServer } from "@tanstack/react-query";
import { useDebugValue, useMemo, useSyncExternalStore } from "react";

export function useMediaQuery(query: string, serverValue = false) {
  const mediaQuery = useMemo(() => {
    if (isServer) return null;
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
