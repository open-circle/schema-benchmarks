import eslintPluginQuery from "@tanstack/eslint-plugin-query";
import eslintPluginRouter from "@tanstack/eslint-plugin-router";
import { defineConfig } from "oxlint";

import { baseConfig, defaultJsPlugins, defaultPlugins } from "../oxlint.config.ts";

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

export default defineConfig({
  extends: [baseConfig],
  jsPlugins: [
    ...defaultJsPlugins,
    { name: "@tanstack/router", specifier: "@tanstack/eslint-plugin-router" },
    { name: "@tanstack/query", specifier: "@tanstack/eslint-plugin-query" },
    { name: "no-relative", specifier: "eslint-plugin-no-relative-import-paths" },
  ],
  plugins: [...defaultPlugins, "react", "jsx-a11y"],
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
  ignorePatterns: ["**/routeTree.gen.ts", "public/mockServiceWorker.js"],
  rules: {
    ...eslintPluginRouter.configs.recommended.rules,
    ...eslintPluginQuery.configs.recommended.rules,

    // would be nice to have on, but we get false positives for external abort signals
    "@tanstack/query/exhaustive-deps": "off",
    "no-relative/no-relative-import-paths": [
      "error",
      { allowSameFolder: true, rootDir: "website/src", prefix: "#src" },
    ],
  },
});
