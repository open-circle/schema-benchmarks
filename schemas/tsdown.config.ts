import * as path from "node:path";

import { filterTransform } from "@schema-benchmarks/utils/rolldown";
import ttsc from "@ttsc/unplugin/rolldown";
import macros from "unplugin-macros/rolldown";
import { defineConfig } from "vite-plus/pack";

export const typiaPathPattern = /[\\/]libraries[\\/]typia[\\/]/;

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
    // tsdown <0.23 compatibility: resolve external dependency subpaths.
    // Remove to preserve subpath imports as written (the new default).
    // https://tsdown.dev/options/dependencies#deps-resolvedepsubpath
    resolveDepSubpath: true,
    neverBundle: [/node:/],
  },
});
