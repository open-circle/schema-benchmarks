import { defineConfig } from "vite-plus";

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
          // Each case is a TypeScript program checked against a library's declarations.
          testTimeout: 120_000,
        },
      },
    ],
  },
  run: {
    tasks: {
      download: {
        command: "node ./src/scripts/download.ts",
        cache: {
          untrackedEnv: ["TTSC_CACHE_DIR"],
        },
      },
    },
  },
});
