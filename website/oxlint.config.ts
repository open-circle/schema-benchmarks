import { defineConfig } from "oxlint";
import rootConfig from "../oxlint.config.ts";

const linkComponents = [
  "Link",
  "LinkChip",
  "InternalLinkButton",
  "ExternalLinkButton",
  "InternalLinkToggleButton",
  "ExternalLinkToggleButton",
  "ListItemInternalLink",
  "ListItemExternalLink",
];

const buttonComponents = ["Button", "ToggleButton", "FloatingActionButton", "Chip"];

export default defineConfig({
  extends: [rootConfig],
  plugins: ["react", "jsx-a11y"],
  settings: {
    "jsx-a11y": {
      components: {
        ...Object.fromEntries(linkComponents.map((component) => [component, "a"])),
        ...Object.fromEntries(buttonComponents.map((component) => [component, "button"])),
      },
      attributes: {
        href: ["to", "href"],
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
  ignorePatterns: ["**/routeTree.gen.ts"],
});
