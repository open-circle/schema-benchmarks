import UnpluginTypia from "@ryoppippi/unplugin-typia/vite";
import macros from "unplugin-macros/vite";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: ["libraries/eager.ts", "libraries/index.ts"],
      formats: ["es"],
    },
    target: ["node24", "esnext"],
    sourcemap: true,
  },
  define: {
    self: "globalThis",
  },
  plugins: [
    UnpluginTypia({ log: false }),
    macros(),
    dts({ rollupTypes: true }),
  ],
});
