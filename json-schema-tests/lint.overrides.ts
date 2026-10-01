import type { OxlintOverride } from "vite-plus/lint";

// oxlint-disable-next-line no-relative/no-relative-import-paths
import { baseJsPlugins } from "../lint.common.ts";

export const jsonSchemaTestsLint = {
  jsPlugins: [
    ...baseJsPlugins,
    { name: "no-relative", specifier: "eslint-plugin-no-relative-import-paths" },
  ],
  env: { node: true },
  rules: {
    "no-relative/no-relative-import-paths": ["error", { allowSameFolder: true }],
  },
} satisfies Omit<OxlintOverride, "files">;
