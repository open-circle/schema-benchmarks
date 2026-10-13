import type { KnipConfig } from "knip";

export default {
  tags: ["-lintignore"],
  compilers: {
    mdx: true,
  },
  workspaces: {
    bench: {
      entry: ["src/scripts/**/*.ts"],
      ignoreFiles: ["*.d.json.ts"],
    },
    schemas: {
      entry: [
        "libraries/index.ts",
        "libraries/zod-compiler/index.ts",
        "libraries/**/benchmarks.ts",
        "libraries/**/download/*.ts",
        "libraries/**/types/index.ts",
        "libraries/**/types/fromType.ts",
      ],
      ignoreFiles: ["libraries/**/download_compiled/**/*.js"],
    },
    utils: {
      ignoreBinaries: ["reg", "gsettings"],
    },
    website: {
      entry: [
        "content-collections.ts",
        "src/routes/blog/-content/*.mdx",
        "lint/plugin.js",
        "offline/root.tsx",
        "offline/index.html",
      ],
      ignoreDependencies: ["normalize.css"],
      postcss: true,
      ignoreFiles: ["**/*.d.json.ts"],
    },
  },
} satisfies KnipConfig;
