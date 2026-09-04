import { filterTransform } from "@schema-benchmarks/utils/rolldown";
import ttsc from "@ttsc/unplugin/vite";
import macros from "unplugin-macros/vite";
import { defineConfig } from "vitest/config";

import { typiaPathPattern } from "./tsdown.config.ts";

export default defineConfig({
  plugins: [filterTransform(ttsc(), typiaPathPattern), macros()],
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.ts", "libraries/**/*.ts", "dist/*.mjs"],
      exclude: ["**/*.test.ts", "**/*.test-d.ts", "**/download.ts", "**/download/**/*.ts"],
    },
    projects: [
      {
        test: {
          name: "node",
          include: ["**/*.node.test.ts"],
        },
      },
      {
        test: {
          name: "typecheck",
          typecheck: {
            enabled: true,
            only: true,
            include: ["**/*.test-d.ts"],
          },
        },
      },
    ],
  },
});
