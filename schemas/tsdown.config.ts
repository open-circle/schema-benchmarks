import * as path from "node:path";

import ttsc from "@ttsc/unplugin/rolldown";
import { defineConfig } from "tsdown";
import macros from "unplugin-macros/rolldown";

export default defineConfig({
  entry: ["libraries/index.ts"],
  format: "esm",
  target: ["node26", "esnext"],
  sourcemap: true,
  dts: true,
  alias: {
    "#src": path.resolve(process.cwd(), "./src/index.ts"),
  },
  plugins: [ttsc(), macros()],
  deps: {
    neverBundle: [/node:/],
  },
});
