import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["import", "promise"],
  categories: {
    style: "error",
  },
  rules: {
    "typescript/array-type": ["error", { default: "generic" }],
  },
  env: {
    builtin: true,
  },
  overrides: [
    {
      files: ["**/*.test.ts", "**/*.test.tsx"],
      plugins: ["vitest"],
      settings: {
        vitest: {
          typecheck: true,
        },
      },
    },
  ],
});
