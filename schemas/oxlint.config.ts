import { defineConfig } from "oxlint";
import rootConfig from "../oxlint.config.ts";

export default defineConfig({
  extends: [rootConfig],
  env: {
    node: true,
  },
  ignorePatterns: ["**/download_compiled/**"],
});
