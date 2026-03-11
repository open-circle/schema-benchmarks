import { mergeConfig, defineConfig } from "vitest/config";

import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    devtools: {
      enabled: true,
    },
  }),
);
