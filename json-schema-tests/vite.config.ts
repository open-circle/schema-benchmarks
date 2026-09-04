import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.ts"],
      exclude: ["**/*.test.ts", "**/*.test.tsx", "**/*.test-d.ts", "**/*.test-d.tsx"],
    },
    projects: [
      {
        test: {
          include: ["**/*.node.test.ts"],
        },
      },
    ],
  },
});
