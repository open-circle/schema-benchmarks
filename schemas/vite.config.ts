import * as path from "node:path";

import UnpluginTypia from "@typia/unplugin/rolldown";
import macros from "unplugin-macros/rolldown";
import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: ["libraries/index.ts"],
    format: "esm",
    target: ["node24", "esnext"],
    sourcemap: true,
    dts: true,
    alias: {
      "#src": path.resolve(process.cwd(), "./src/index.ts"),
    },
    deps: {
      neverBundle: [/node:/],
    },
    plugins: [UnpluginTypia({ log: false }), macros()],
  },
  test: {
    include: ["**/*.node.test.ts"], // not tsx - if you're using React, test in the browser
  },
});
