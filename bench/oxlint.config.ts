import { defineConfig } from "oxlint";

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
    "no-relative/no-relative-import-paths": [
      "error",
      { allowSameFolder: true, rootDir: "bench/src", prefix: "#src" },
    ],
  },
});
