import { configs as eslintDependConfigs } from "eslint-plugin-depend";
import playwright from "eslint-plugin-playwright";
import { defineConfig } from "vite-plus";

import { benchLint } from "./bench/lint.overrides.ts";
import { jsonSchemaTestsLint } from "./json-schema-tests/lint.overrides.ts";
import { baseJsPlugins } from "./lint.common.ts";
import { schemasLint } from "./schemas/lint.overrides.ts";
import { utilsLint } from "./utils/lint.overrides.ts";
import { websiteLint, websiteLintSettings } from "./website/lint.overrides.ts";

export default defineConfig({
  lint: {
    plugins: ["eslint", "typescript", "unicorn", "oxc"],
    jsPlugins: baseJsPlugins,
    categories: {
      correctness: "error",
      suspicious: "warn",
    },
    options: { typeAware: true, typeCheck: true, reportUnusedDisableDirectives: "error" },
    settings: {
      vitest: {
        typecheck: true,
      },
      ...websiteLintSettings,
    },
    env: {
      builtin: true,
    },
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
      "eslint/no-shadow": "off",
      "eslint/no-underscore-dangle": "off",
      "typescript/array-type": ["error", { default: "generic" }],
      "react/react-in-jsx-scope": "off",
      "typescript/no-unsafe-type-assertion": "off",
      "typescript/consistent-type-imports": "error",
      "typescript/consistent-return": "off",
      "typescript/no-deprecated": "error",
      "no-underscore-dangle": "off",
      "oxc/no-this-in-exported-function": "off",
      ...eslintDependConfigs["flat/recommended"].rules,
    },
    ignorePatterns: [
      "schemas/libraries/**/download_compiled/**",
      "schemas/libraries/**/download/**",
      "schemas/libraries/**/*.gen.ts",
      "schemas/libraries/**/compiled/**",
      "website/**/routeTree.gen.ts",
      "website/public/mockServiceWorker.js",
    ],
    overrides: [
      {
        files: ["**/*.{browser,node}.test.ts", "**/*.{browser,node}.test.tsx"],
        plugins: ["vitest"],
        rules: {
          "vitest/no-standalone-expect": [
            "error",
            {
              additionalTestBlockFunctions: ["it", "test"],
            },
          ],
          // Only `no-standalone-expect` was enforced before the Vite+ migration; the
          // other `vitest/*` rules below are newly activated by the `correctness`/
          // `suspicious` category cascade onto the `vitest` plugin and are turned off
          // here to preserve prior behavior rather than newly enforcing them repo-wide.
          "vitest/no-conditional-expect": "off",
          "vitest/no-conditional-tests": "off",
          "vitest/expect-expect": "off",
          "vitest/require-to-throw-message": "off",
          "vitest/require-mock-type-parameters": "off",
        },
      },
      {
        files: ["**/e2e/**", "**/*.e2e.*.ts"],
        jsPlugins: [
          ...baseJsPlugins,
          { name: "playwright", specifier: "eslint-plugin-playwright" },
        ],
        rules: {
          ...playwright.configs["flat/recommended"].rules,
          "playwright/no-skipped-test": ["warn", { allowConditional: true }],
          "playwright/expect-expect": ["error", { assertFunctionPatterns: ["^expect.*"] }],
          "playwright/require-to-pass-timeout": "error",
        },
      },
      { files: ["schemas/**"], ...schemasLint },
      { files: ["bench/**"], ...benchLint },
      { files: ["json-schema-tests/**"], ...jsonSchemaTestsLint },
      { files: ["utils/**"], ...utilsLint },
      { files: ["website/**"], ...websiteLint },
    ],
  },
  fmt: {
    ignorePatterns: [
      "bench/bench.json",
      "bench/download.json",
      "bench/stack.json",
      "bench/json-schema.json",
      "bench/types.json",
      "schemas/libraries/**/download_compiled/**",
      "schemas/libraries/**/compiled/**",
      "schemas/libraries/**/*.gen.ts",
      "website/**/routeTree.gen.ts",
      "website/src/routes/blog/-content/assets/**/*.json",
    ],
    sortImports: {},
  },
  staged: {
    "*": "vp check --fix --no-error-on-unmatched-pattern",
  },
  run: {
    tasks: {
      "schemas:build": {
        command: "vpr --filter @schema-benchmarks/schemas build",
        cache: {
          untrackedEnv: ["TTSC_CACHE_DIR"],
        },
      },
      "bench:download": {
        command: "vpr --filter @schema-benchmarks/bench download",
        cache: {
          untrackedEnv: ["TTSC_CACHE_DIR"],
        },
      },
      // Replaces the previous `&&`-chained script so each benchmark suite is its own cached step.
      "bench:all": {
        command: [
          "vpr bench:download",
          "vpr bench:bench",
          "vpr bench:json-schema",
          "vpr bench:stack",
          "vpr bench:types",
        ],
        cache: {
          untrackedEnv: ["TTSC_CACHE_DIR"],
        },
      },
    },
  },
});
