import type { IfMaybeUndefined, RemoveIndexSignature } from "@schema-benchmarks/utils";

import type { NpmSite, Style, Theme, Ligature } from "./prefs/constants";

interface AnalyticEvents {
  [event: string]: object | undefined;
  change_theme: { theme: Theme };
  change_style: { style: Style };
  change_npm_site: { npmSite: NpmSite };
  change_ligature: { ligature: Ligature };
  external_link_click: { url: string };
}

type AnalyticEventArgs = {
  [T in keyof RemoveIndexSignature<AnalyticEvents>]-?: IfMaybeUndefined<
    AnalyticEvents[T],
    [name: T, data?: AnalyticEvents[T]],
    [name: T, data: AnalyticEvents[T]]
  >;
}[keyof RemoveIndexSignature<AnalyticEvents>];

declare global {
  interface Window {
    umami?: {
      track: (...args: AnalyticEventArgs | []) => void;
    };
  }
}

export function trackEventProps(
  ...[name, data]: Extract<AnalyticEventArgs, [string, Record<string, string>?]>
) {
  return {
    "data-umami-event": name,
    ...Object.fromEntries(
      // oxlint-disable-next-line typescript/no-unnecessary-type-conversion
      Object.entries(data ?? {}).map(([key, value]) => [`data-umami-event-${key}`, String(value)]),
    ),
  };
}

export function trackedLinkProps(href: string) {
  return {
    href,
    ...trackEventProps("external_link_click", { url: href }),
  };
}
