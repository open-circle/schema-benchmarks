import { defineConfig } from "vite-plus";

import baseConfig from "./oxlint.base.config.ts";

export default defineConfig({
  lint: {
    extends: [baseConfig],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    ignorePatterns: [
      "bench/bench.json",
      "bench/download.json",
      "bench/stack.json",
      "schemas/libraries/**/download_compiled/**",
      "schemas/libraries/**/download/**",
      "schemas/libraries/**/download.ts",
      "website/**/routeTree.gen.ts",
      "website/src/routes/blog/-content/assets/**/*.json",
      "website/public/mockServiceWorker.js",
    ],
  },
  fmt: {
    ignorePatterns: [
      "bench/bench.json",
      "bench/download.json",
      "bench/stack.json",
      "schemas/libraries/**/download_compiled/**",
      "website/**/routeTree.gen.ts",
      "website/src/routes/blog/-content/assets/**/*.json",
      "website/public/mockServiceWorker.js",
    ],
    experimentalSortImports: {},
  },
});
