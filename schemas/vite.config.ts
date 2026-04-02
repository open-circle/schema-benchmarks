import UnpluginTypia from "@typia/unplugin/vite";
import macros from "unplugin-macros/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [UnpluginTypia({ log: false }), macros()],
  test: {
    include: ["**/*.node.test.ts"], // not tsx - if you're using React, test in the browser
  },
});
