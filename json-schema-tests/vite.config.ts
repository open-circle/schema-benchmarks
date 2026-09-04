import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.ts"],
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
