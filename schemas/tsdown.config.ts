import * as path from "node:path";

import UnpluginTypia from "@typia/unplugin/rolldown";
import { defineConfig } from "tsdown";
import macros from "unplugin-macros/rolldown";

export default defineConfig({
  entry: ["libraries/index.ts"],
  format: "esm",
  target: ["node24", "esnext"],
  sourcemap: true,
  dts: true,
  alias: {
    "#src": path.resolve(process.cwd(), "./src/index.ts"),
  },
  plugins: [UnpluginTypia({ log: false }), macros()],
  deps: {
    neverBundle: [/node:/],
  },
});
