import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    suspicious: "warn",
  },
  rules: {
    "eslint/no-shadow": "off",
    "typescript/array-type": ["error", { default: "generic" }],
    "react/react-in-jsx-scope": "off",
    "typescript/no-unsafe-type-assertion": "off",
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
});
