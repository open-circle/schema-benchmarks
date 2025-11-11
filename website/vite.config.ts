import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import prismjs from "vite-plugin-prismjs";
import viteTsConfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
	plugins: [
		// this is the plugin that enables path aliases
		viteTsConfigPaths({
			projects: ["./tsconfig.json"],
		}),
		tanstackStart(),
		viteReact(),
		prismjs({
			languages: ["typescript"],
		}),
	],
	resolve: {
		alias: {
			"@": "/src",
		},
	},
});

export default config;
