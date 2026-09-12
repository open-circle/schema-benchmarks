import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.ts"],
      exclude: ["**/*.test.ts"],
    },
    projects: [
      {
        test: {
          name: "node",
          include: ["**/*.node.test.ts"],
          // each case is a TypeScript program checked against a library's declarations
          testTimeout: 120_000,
        },
      },
    ],
  },
});
