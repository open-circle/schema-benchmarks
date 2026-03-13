import { defineConfig } from "vite-plus";

import { baseConfig } from "../oxlint.base.config.ts";

export default defineConfig({
  lint: {
    extends: [baseConfig],
    env: {
      node: true,
    },
  },
});
