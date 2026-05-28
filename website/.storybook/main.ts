import { defineMain } from "@storybook/tanstack-react/node";
import prismjs from "vite-plugin-prismjs";

export default defineMain({
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [],
  framework: {
    name: "@storybook/tanstack-react",
    options: {},
  },
  staticDirs: ["../public"],
  async viteFinal(config) {
    config.plugins?.push(prismjs({ languages: "all" }));
    return config;
  },
});
