import contentCollections from "@content-collections/vite";
import mdx from "@mdx-js/rollup";
import netlify from "@netlify/vite-plugin-tanstack-start";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import rehypeCodeProps from "rehype-mdx-code-props";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";
import {
  dataTypeProps,
  errorTypeProps,
  optimizeTypeProps,
} from "./src/features/benchmark/constants";
import { minifyTypeProps } from "./src/features/download/constants";
import { speedPresets } from "./src/features/download/speed";
import { sidebarGroups } from "./src/shared/components/sidebar/groups";
import * as scales from "./src/shared/data/scale";
import materialSymbols from "./vite/symbols";

const config = defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    devtools(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart(),
    mdx({
      rehypePlugins: [rehypePrism, rehypeCodeProps, rehypeSlug],
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      providerImportSource: "@mdx-js/react",
    }),
    netlify(),
    viteReact(),
    materialSymbols({
      knownSymbols: [
        ...sidebarGroups.flatMap((group) =>
          group.links.map((link) => link.icon),
        ),
        ...[
          errorTypeProps,
          optimizeTypeProps,
          minifyTypeProps,
          dataTypeProps,
        ].flatMap((props) =>
          Object.values(props.labels).map((label) => label.icon),
        ),
        ...Object.values(speedPresets).map((preset) => preset.icon),
        ...scales.sentiment,
        ...scales.stat,
      ],
    }),
    contentCollections(),
  ],
  resolve: {
    alias: {
      "@test": "/test",
      "@": "/src",
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          include: ["**/*.node.test.ts"], // not tsx - if you're using React, test in the browser
          setupFiles: ["./test/common/setup.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "browser",
          include: ["**/*.browser.test.ts", "**/*.browser.test.tsx"],
          setupFiles: ["./test/common/setup.ts", "./test/browser/setup.ts"],
          browser: {
            enabled: true,
            provider: playwright(),
            // https://vitest.dev/guide/browser/playwright
            instances: [{ browser: "chromium" }],
            headless: !!process.env.CI,
          },
        },
      },
      {
        test: {
          typecheck: {
            enabled: true,
            only: true,
            include: ["**/*.test-d.ts"],
          },
        },
      },
    ],
  },
});

export default config;
