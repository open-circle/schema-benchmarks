import contentCollections from "@content-collections/vite";
import mdx from "@mdx-js/rollup";
import netlify from "@netlify/vite-plugin-tanstack-start";
import { devtools } from "@tanstack/devtools-vite";
import eslintPluginQuery from "@tanstack/eslint-plugin-query";
import eslintPluginRouter from "@tanstack/eslint-plugin-router";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import rehypeCodeProps from "rehype-mdx-code-props";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vite-plus";
import { playwright } from "vite-plus/test/browser-playwright";

import baseConfig from "../oxlint.base.config.ts";
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

const linkComponents = [
  // "Link",
  // "LinkChip",
  // "InternalLinkButton",
  "ExternalLinkButton",
  // "InternalLinkToggleButton",
  "ExternalLinkToggleButton",
  // "ListItemInternalLink",
  "ListItemExternalLink",
];

const buttonComponents = [
  "Button",
  "ToggleButton",
  "FloatingActionButton",
  "Chip",
  "ListItemButton",
];

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
  lint: {
    extends: [baseConfig],
    jsPlugins: [
      { name: "@tanstack/router", specifier: "@tanstack/eslint-plugin-router" },
      { name: "@tanstack/query", specifier: "@tanstack/eslint-plugin-query" },
    ],
    plugins: ["react", "jsx-a11y"],
    settings: {
      "jsx-a11y": {
        components: {
          ...Object.fromEntries(linkComponents.map((component) => [component, "a"])),
          ...Object.fromEntries(buttonComponents.map((component) => [component, "button"])),
          TextField: "input",
        },
      },
      react: {
        componentWrapperFunctions: ["withTooltip", "createLink"],
        linkComponents: linkComponents.map((component) => ({
          name: component,
          attributes: ["to", "href"],
        })),
      },
    },
    env: {
      // client side
      browser: true,
      // server side
      node: true,
    },
    rules: {
      ...eslintPluginRouter.configs.recommended.rules,
      ...eslintPluginQuery.configs.recommended.rules,

      // would be nice to have on, but we get false positives for external abort signals
      "@tanstack/query/exhaustive-deps": "off",
    },
  },
  run: {
    tasks: {
      storybook: {
        command: "storybook dev -p 6006",
      },
      preview: {
        command: "node preview.ts",
      },
    },
  },
});

export default config;
