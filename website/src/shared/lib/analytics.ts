import { IfMaybeUndefined, RemoveIndexSignature } from "@schema-benchmarks/utils";

import { Style, Theme } from "./prefs/constants";

interface AnalyticEvents {
  [event: string]: object | undefined;
  change_theme: { theme: Theme };
  change_style: { style: Style };
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
  ...[name, data]: Extract<AnalyticEventArgs, [string, Record<string, string>]>
) {
  const props: Record<`data-umami-event${string}`, string> = {
    "data-umami-event": name,
  };
  for (const [key, value] of Object.entries(data)) {
    props[`data-umami-event-${key}`] = String(value);
  }
  return props;
}

export function trackedLinkProps(href: string) {
  return {
    href,
    ...trackEventProps("external_link_click", { url: href }),
  };
}
