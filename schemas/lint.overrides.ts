import type { OxlintOverride } from "vite-plus/lint";

export const schemasLint = {
  env: { node: true },
} satisfies Omit<OxlintOverride, "files">;
