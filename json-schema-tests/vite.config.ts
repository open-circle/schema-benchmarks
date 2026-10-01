import { defineConfig } from "vite-plus";

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
  run: {
    tasks: {
      // Replaces the implicit precheckout/postcheckout scripts with one explicit, cached pipeline.
      checkout: {
        command: [
          "del-cli tests remotes",
          "node ./scripts/checkout.ts",
          "node ./scripts/gen-constants.ts",
        ],
      },
    },
  },
});
