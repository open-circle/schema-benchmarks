import { useDebugValue } from "react";

import { useMediaQuery } from "./use-media-query";

const queries = {
  phone: "max-width: 599px",
  tabletSmall: "(min-width: 600px) and (max-width: 904px)",
  tabletLarge: "(min-width: 905px) and (max-width: 1239px)",
  laptop: "(min-width: 1240px) and (max-width: 1439px)",
  desktop: "min-width: 1440px",
} as const;

export type Breakpoint = keyof typeof queries;

export function useBreakpoints(breakpoints: Array<Breakpoint>, serverValue = false) {
  const matches = useMediaQuery(
    breakpoints.map((breakpoint) => `(${queries[breakpoint]})`).join(" or "),
    serverValue,
  );
  useDebugValue({ breakpoints, matches });
  return matches;
}
