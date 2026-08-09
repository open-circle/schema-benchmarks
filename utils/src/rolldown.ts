import type { Plugin } from "rolldown";

export function filterTransform<TPlugin extends Plugin>(plugin: TPlugin, pattern: RegExp): TPlugin {
  const transform = plugin.transform;

  if (!transform) {
    return plugin;
  }

  const handler = typeof transform === "function" ? transform : transform.handler;
  if (!handler) {
    return plugin;
  }

  return {
    ...plugin,
    transform: {
      ...(typeof transform === "function" ? {} : transform),
      filter: { id: pattern },
      handler,
    },
  };
}
