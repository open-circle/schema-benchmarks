import { useEffect, useReducer } from "react";

import { preloadImage } from "#/shared/lib/fetch";

export type ImageLoadState = "unloaded" | "loading" | "loaded" | "error";

export function useLoadImage(src?: string) {
  const [state, setState] = useReducer(
    (nextState, state) => {
      if (nextState === "unloaded" || state === "loading") return nextState;
      return state;
    },
    src ? "loading" : "unloaded",
  );
  useEffect(() => {
    if (src) {
      setState("loading");
      preloadImage(src)
        .then(() => setState("loaded"))
        .catch(() => setState("error"));
    } else {
      setState("unloaded");
    }
  }, [src]);
  return state;
}
