import UnpluginTypia from "@ryoppippi/unplugin-typia/vite";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: "index.ts",
			formats: ["es"],
			name: "bench",
			fileName: "bench",
		},
	},
	plugins: [UnpluginTypia()],
});
