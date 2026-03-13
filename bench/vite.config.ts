import { defineConfig } from "vite-plus";

import baseConfig from "../oxlint.base.config.ts";

export default defineConfig({
  lint: {
    extends: [baseConfig],
    env: {
      node: true,
    },
  },
  run: {
    tasks: {
      download: {
        command: "node ./src/scripts/download.ts",
      },
      bench: {
        command: "node ./src/scripts/bench/orchestrate.ts",
      },
      stack: {
        command: "node ./src/scripts/stack.ts",
      },
      all: {
        command: "",
        dependsOn: ["download", "bench", "stack"],
      },
    },
  },
});
