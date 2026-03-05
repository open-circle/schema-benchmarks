import { defineConfig } from "oxlint";

import { baseConfig } from "../oxlint.config.ts";

export default defineConfig({
  extends: [baseConfig],
  env: {
    node: true,
  },
  ignorePatterns: ["**/download_compiled/**", "**/download/**", "**/download.ts"],
});
