import UnpluginTypia from "@ryoppippi/unplugin-typia/vite";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "libraries/index.ts",
      formats: ["es"],
    },
  },
  plugins: [UnpluginTypia({ log: false })],
});
