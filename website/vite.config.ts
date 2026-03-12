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
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vitest/config";

import {
  dataTypeProps,
  errorTypeProps,
  optimizeTypeProps,
  stringFormatProps,
} from "./src/routes/_benchmarks/_runtime/-constants";
import { minifyTypeProps } from "./src/routes/_benchmarks/download/-constants";
import { speedPresets } from "./src/routes/_benchmarks/download/-speed";
import { admonitionDefaults } from "./src/shared/components/admonition/constants";
import { sidebarGroups } from "./src/shared/components/sidebar/groups";
import { sortDirectionIcons } from "./src/shared/components/table/constants";
import * as scales from "./src/shared/data/scale";
import { styleLabels, themeLabels } from "./src/shared/lib/prefs/constants";
import materialSymbols from "./vite/symbols";

const config = defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    devtools(),
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
        "keyboard_arrow_down",
        ...sidebarGroups.flatMap((group) => group.links.map((link) => link.icon)),
        ...[
          errorTypeProps,
          optimizeTypeProps,
          minifyTypeProps,
          dataTypeProps,
          stringFormatProps,
        ].flatMap((props) => Object.values(props.labels).map((label) => label.icon)),
        ...[speedPresets, admonitionDefaults, themeLabels, styleLabels].flatMap((map) =>
          Object.values(map).map((value) => value.icon),
        ),
        ...Object.values(sortDirectionIcons),
        ...scales.sentiment,
        ...scales.stat,
      ],
    }),
    svgr(),
    !process.env.VITEST && contentCollections(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      includeAssets: ["fonts/*.woff2", "bench.json", "stack.json", "download.json"],
      manifest: {
        background_color: "#eceff1",
        display: "standalone",
        icons: [
          {
            sizes: "64x64 32x32 24x24 16x16",
            src: "favicon_dark.ico",
            type: "image/x-icon",
          },
          {
            sizes: "192x192",
            src: "logo192_dark.png",
            type: "image/png",
          },
          {
            sizes: "512x512",
            src: "logo512_dark.png",
            type: "image/png",
          },
        ],
        name: "Schema Benchmarks",
        short_name: "Schema Benchmarks",
        start_url: ".",
        theme_color: "#21222c",
      },
    }),
  ],
  resolve: {
    alias: {
      "#test/": "/test/",
      "#storybook/": "/.storybook/",
      "#/": "/src/",
    },
    tsconfigPaths: true,
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
  ssr: {
    noExternal: ["react-tweet"],
  },
});

export default config;
