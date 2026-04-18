import type { KnipConfig } from "knip";

export default {
  tags: ["-lintignore"],
  compilers: {
    mdx: true,
  },
  workspaces: {
    bench: {
      entry: ["src/index.ts", "src/scripts/**/*.ts"],
      ignoreFiles: ["*.d.json.ts"],
    },
    schemas: {
      entry: [
        "src/index.ts",
        "libraries/**/benchmarks.ts",
        "libraries/**/download.ts",
        "libraries/**/download/*.ts",
      ],
      ignoreFiles: ["libraries/**/download_compiled/**/*.js"],
    },
    utils: {},
    website: {
      entry: ["content-collections.ts", "src/routes/blog/-content/*.mdx"],
      postcss: true,
      ignoreFiles: ["**/*.d.json.ts"],
    },
  },
} satisfies KnipConfig;
