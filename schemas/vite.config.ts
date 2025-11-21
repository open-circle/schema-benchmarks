import UnpluginTypia from "@ryoppippi/unplugin-typia/vite";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "libraries/index.ts",
      formats: ["es"],
    },
  },
  plugins: [UnpluginTypia({ log: false }), dts({ rollupTypes: true })],
});
