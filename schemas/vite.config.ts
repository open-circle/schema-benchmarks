import { filterTransform } from "@schema-benchmarks/utils/rolldown";
import ttsc from "@ttsc/unplugin/vite";
import macros from "unplugin-macros/vite";
import { defineConfig } from "vitest/config";

import { typiaPathPattern } from "./tsdown.config.ts";

export default defineConfig({
  plugins: [filterTransform(ttsc(), typiaPathPattern), macros()],
  test: {
    include: ["**/*.node.test.ts"], // not tsx - if you're using React, test in the browser
  },
});
