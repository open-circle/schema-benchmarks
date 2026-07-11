import ttsc from "@ttsc/unplugin/vite";
import macros from "unplugin-macros/vite";
import { defineConfig } from "vitest/config";

import { typiaOnly } from "./tsdown.config";

export default defineConfig({
  plugins: [typiaOnly(ttsc()), macros()],
  test: {
    include: ["**/*.node.test.ts"], // not tsx - if you're using React, test in the browser
  },
});
