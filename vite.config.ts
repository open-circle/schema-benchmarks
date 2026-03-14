import { defineConfig } from "vite-plus";
import type { OxlintConfig } from "vite-plus/lint";

export const baseLintConfig: OxlintConfig = {
  categories: {
    suspicious: "warn",
  },
  rules: {
    "eslint/no-shadow": "off",
    "typescript/array-type": ["error", { default: "generic" }],
    "react/react-in-jsx-scope": "off",
    "typescript/no-unsafe-type-assertion": "off",
    "typescript/consistent-type-imports": "error",
    "no-this-in-exported-function": "off",
  },
  settings: {
    vitest: {
      typecheck: true,
    },
  },
  env: {
    builtin: true,
  },
  overrides: [
    {
      files: ["**/*.test.ts", "**/*.test.tsx"],
      plugins: ["vitest"],
    },
  ],
};

export default defineConfig({
  lint: {
    extends: [baseLintConfig],
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
      "**/dist/**",
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
      "**/dist/**",
    ],
    experimentalSortImports: {},
  },
  staged: { "*": "vp check --fix" },
});
