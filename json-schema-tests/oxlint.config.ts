import { defineConfig } from "oxlint";

// oxlint-disable-next-line no-relative/no-relative-import-paths
import { baseConfig } from "../oxlint.config.ts";

export default defineConfig({
  extends: [baseConfig],
  jsPlugins: [
    ...baseConfig.jsPlugins,
    { name: "no-relative", specifier: "eslint-plugin-no-relative-import-paths" },
  ],
  env: {
    node: true,
  },
  rules: {
    "no-relative/no-relative-import-paths": ["error", { allowSameFolder: true }],
  },
});
