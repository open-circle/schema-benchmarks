import { defineConfig } from "vite-plus";

import websiteOverrides, { websiteSettings } from "./website/oxlint.override.ts";

export default defineConfig({
  lint: {
    ignorePatterns: [
      "bench/bench.json",
      "bench/download.json",
      "bench/stack.json",
      "schemas/libraries/**/download_compiled/**",
      "schemas/libraries/**/download/**",
      "schemas/libraries/**/download.ts",
      "website/**/routeTree.gen.ts",
      "website/public/mockServiceWorker.js",
      "website/src/routes/blog/-content/assets/**/*.json",
    ],
    options: { typeAware: true, typeCheck: true },
    categories: {
      correctness: "error",
      suspicious: "warn",
    },
    rules: {
      "eslint/no-shadow": "off",
      "typescript/array-type": ["error", { default: "generic" }],
      "react/react-in-jsx-scope": "off",
      "typescript/no-unsafe-type-assertion": "off",
      "typescript/consistent-type-imports": "error",
    },
    settings: {
      vitest: { typecheck: true },
      ...websiteSettings,
    },
    env: { builtin: true },
    overrides: [
      {
        files: ["**/*.test.ts", "**/*.test.tsx"],
        plugins: ["vitest"],
      },
      {
        files: ["./bench/**/*"],
        env: { node: true },
      },
      {
        files: ["./schemas/**/*"],
        env: { node: true },
      },
      {
        files: ["./schemas/**/*"],
        env: { "shared-node-browser": true },
      },
      {
        files: ["./website/**/*"],
        ...websiteOverrides,
      },
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
    ],
    experimentalSortImports: {},
  },
});
