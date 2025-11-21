import UnpluginTypia from "@ryoppippi/unplugin-typia/vite";
import macros from "unplugin-macros/vite";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "libraries/index.ts",
      formats: ["es"],
    },
    sourcemap: true,
  },
  plugins: [
    UnpluginTypia({ log: false }),
    macros(),
    dts({ rollupTypes: true }),
  ],
});
