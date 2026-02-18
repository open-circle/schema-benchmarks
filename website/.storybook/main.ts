import { defineMain } from "@storybook/react-vite/node";
import prismjs from "vite-plugin-prismjs";

export default defineMain({
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: ["../public"],
  async viteFinal(config) {
    config.plugins?.push(prismjs({ languages: "all" }));
    return config;
  },
});
