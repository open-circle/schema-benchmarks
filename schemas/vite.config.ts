import { filterTransform } from "@schema-benchmarks/utils/rolldown";
import ttsc from "@ttsc/unplugin/vite";
import macros from "unplugin-macros/vite";
import { defineConfig, lazyPlugins } from "vite-plus";

import tsdownConfig from "./tsdown.config.js";
import { typiaPathPattern } from "./tsdown.config.ts";

export default defineConfig({
  pack: tsdownConfig,
  // @ttsc/unplugin's vite plugin is typed against vite's own Plugin type, which
  // isn't structurally assignable to the raw rolldown Plugin type filterTransform
  // (and lazyPlugins) expect here.
  plugins: lazyPlugins(() => [filterTransform(ttsc() as any, typiaPathPattern), macros()]),
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.ts", "libraries/**/*.ts", "dist/*.mjs"],
      exclude: ["**/*.test.ts", "**/*.test-d.ts", "**/download/**/*.ts"],
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
  run: {
    tasks: {
      // Replaces the implicit prebuild/postbuild scripts with one explicit, cached pipeline.
      build: {
        command: ["vpr gen:paseri", "vpr gen:zod-compiler", "vp pack", "vpr gen:json-schemas"],
        cache: {
          untrackedEnv: ["TTSC_CACHE_DIR"],
        },
      },
    },
  },
});
