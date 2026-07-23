import playwright from "eslint-plugin-playwright";
import { defineConfig } from "oxlint";

export const defaultJsPlugins = [{ name: "depend", specifier: "eslint-plugin-depend" }];

export const defaultPlugins = ["eslint", "typescript", "unicorn", "oxc"] as const;

export const baseConfig = defineConfig({
  jsPlugins: defaultJsPlugins,
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
    "typescript/consistent-return": "off",
    "depend/ban-dependencies": "error",
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
      plugins: [...defaultPlugins, "vitest"],
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
      jsPlugins: [
        ...defaultJsPlugins,
        { name: "playwright", specifier: "eslint-plugin-playwright" },
      ],
      rules: {
        ...playwright.configs["flat/recommended"].rules,
        "playwright/no-skipped-test": ["warn", { allowConditional: true }],
        // doesn't work with our helper functions
        "playwright/expect-expect": "off",
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
