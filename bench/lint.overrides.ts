import type { OxlintOverride } from "vite-plus/lint";

import { baseJsPlugins } from "../lint.common.ts";

export const benchLint = {
  jsPlugins: [
    ...baseJsPlugins,
    { name: "no-relative", specifier: "eslint-plugin-no-relative-import-paths" },
  ],
  env: { node: true },
  rules: {
    "no-relative/no-relative-import-paths": [
      "error",
      { allowSameFolder: true, rootDir: "bench/src", prefix: "#src" },
    ],
  },
} satisfies Omit<OxlintOverride, "files">;
