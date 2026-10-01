import type { OxlintOverride } from "vite-plus/lint";

export const utilsLint = {
  env: { "shared-node-browser": true },
} satisfies Omit<OxlintOverride, "files">;
