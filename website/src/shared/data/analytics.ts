import { IfMaybeUndefined, RemoveIndexSignature } from "@schema-benchmarks/utils";

import { Style, Theme } from "../lib/prefs/constants";

interface AnalyticEvents {
  [event: string]: object | undefined;
  change_theme: { theme: Theme };
  change_style: { style: Style };
}

type AnalyticEventArgs = {
  [T in keyof RemoveIndexSignature<AnalyticEvents>]: IfMaybeUndefined<
    AnalyticEvents[T],
    [name: T, data?: AnalyticEvents[T]],
    [name: T, data: AnalyticEvents[T]]
  >;
}[keyof RemoveIndexSignature<AnalyticEvents>];

declare global {
  interface Window {
    umami?: {
      track: (...args: AnalyticEventArgs) => void;
    };
  }
}
