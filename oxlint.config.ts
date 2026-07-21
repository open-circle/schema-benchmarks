import { configs as eslintDependConfigs } from "eslint-plugin-depend";
import playwright from "eslint-plugin-playwright";
import type { OxlintConfig } from "oxlint";
import { defineConfig } from "oxlint";

const jsPlugins = [{ name: "depend", specifier: "eslint-plugin-depend" }];

const plugins = ["eslint", "typescript", "unicorn", "oxc"] satisfies OxlintConfig["plugins"];

export const baseConfig = defineConfig({
  plugins,
  jsPlugins,
  categories: {
    correctness: "error",
    suspicious: "warn",
  },
  rules: {
    "eslint/no-shadow": "off",
    "eslint/no-underscore-dangle": "off",
    "typescript/array-type": ["error", { default: "generic" }],
    "react/react-in-jsx-scope": "off",
    "typescript/no-unsafe-type-assertion": "off",
    "typescript/consistent-type-imports": "error",
    "typescript/consistent-return": "off",
    ...eslintDependConfigs["flat/recommended"].rules,
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
      files: ["**/*.{browser,node}.test.ts", "**/*.{browser,node}.test.tsx"],
      plugins: [...plugins, "vitest"],
      rules: {
        "vitest/no-standalone-expect": [
          "error",
          {
            additionalTestBlockFunctions: ["it", "test"],
          },
        ],
      },
    },
    {
      files: ["**/e2e/**"],
      jsPlugins: [...jsPlugins, { name: "playwright", specifier: "eslint-plugin-playwright" }],
      rules: {
        ...playwright.configs["flat/recommended"].rules,
        "playwright/no-skipped-test": ["warn", { allowConditional: true }],
        "playwright/expect-expect": ["error", { assertFunctionPatterns: ["^expect.*"] }],
      },
    },
  ],
});

export default defineConfig({
  extends: [baseConfig],
  options: {
    typeAware: true,
    reportUnusedDisableDirectives: "error",
  },
});
