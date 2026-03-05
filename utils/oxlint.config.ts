import { defineConfig } from "oxlint";

import { baseConfig } from "../oxlint.config.ts";

export default defineConfig({
  extends: [baseConfig],
  env: {
    "shared-node-browser": true,
  },
});
