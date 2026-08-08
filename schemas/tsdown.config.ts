import * as path from "node:path";

import ttsc from "@ttsc/unplugin/rolldown";
import { defineConfig, type TsdownPlugin } from "tsdown";
import macros from "unplugin-macros/rolldown";

export const typiaPathPattern = /[\\/]libraries[\\/]typia[\\/]/;
export function filterTransform<A>(plugin: TsdownPlugin<A>, pattern: RegExp): TsdownPlugin<A> {
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

export default defineConfig({
  entry: ["libraries/index.ts"],
  format: "esm",
  target: ["node26", "esnext"],
  sourcemap: true,
  dts: true,
  alias: {
    "#src": path.resolve(process.cwd(), "./src/index.ts"),
  },
  plugins: [filterTransform(ttsc(), typiaPathPattern), macros()],
  deps: {
    neverBundle: [/node:/],
  },
});
