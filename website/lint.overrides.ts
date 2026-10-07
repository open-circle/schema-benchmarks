import eslintPluginQuery from "@tanstack/eslint-plugin-query";
import eslintPluginRouter from "@tanstack/eslint-plugin-router";
import type { OxlintOverride, OxlintConfig } from "vite-plus/lint";

import { baseJsPlugins } from "../lint.common.ts";
import "./lint/oxlint";

const linkComponents = ["ExternalLinkButton", "ExternalLinkToggleButton", "ListItemExternalLink"];

const buttonComponents = [
  "Button",
  "ToggleButton",
  "FloatingActionButton",
  "Chip",
  "ListItemButton",
];

// Merged into the root config's top-level `lint.settings`, since overrides don't support `settings`.
export const websiteLintSettings = {
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
} satisfies OxlintConfig["settings"];

export const websiteLint = {
  jsPlugins: [
    ...baseJsPlugins,
    { name: "@tanstack/router", specifier: "@tanstack/eslint-plugin-router" },
    { name: "@tanstack/query", specifier: "@tanstack/eslint-plugin-query" },
    { name: "no-relative", specifier: "eslint-plugin-no-relative-import-paths" },
  ],
  plugins: ["react", "jsx-a11y"],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/rules-of-hooks": "error",
    ...eslintPluginRouter.configs.recommended.rules,
    ...eslintPluginQuery.configs.recommended.rules,
    "@tanstack/query/exhaustive-deps": "off",
    "no-relative/no-relative-import-paths": [
      "error",
      { allowSameFolder: true, rootDir: "website/src", prefix: "#src" },
    ],
    "jsx-a11y/label-has-associated-control": [
      "warn",
      {
        controlComponents: ["Checkbox", "Radio"],
        labelComponents: ["ControlLabel"],
      },
    ],
  },
} satisfies Omit<OxlintOverride, "files">;
