import UnpluginTypia from "@ryoppippi/unplugin-typia/vite";
import { defineConfig } from "vitest/config";
import { CustomReporter } from "./reporter";

export default defineConfig({
	plugins: [UnpluginTypia()],
	test: {
		benchmark: {
			reporters: ["default", new CustomReporter()],
		},
	},
});
