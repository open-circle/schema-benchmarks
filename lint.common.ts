import type { ExternalPluginEntry } from "vite-plus/lint";

// Shared across the root config and package-level lint.overrides.ts files; lives
// here (rather than in vite.config.ts) so those files can import it without a
// circular import back to the root config.
export const baseJsPlugins: Array<ExternalPluginEntry> = [
  { name: "vite-plus", specifier: "vite-plus/oxlint-plugin" },
  { name: "depend", specifier: "eslint-plugin-depend" },
];
