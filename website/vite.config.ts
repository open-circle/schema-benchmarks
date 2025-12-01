import netlify from "@netlify/vite-plugin-tanstack-start";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";
import { sidebarGroups } from "./src/components/sidebar/groups";
import * as scales from "./src/data/scale";
import {
  dataTypeProps,
  errorTypeProps,
  optimizeTypeProps,
} from "./src/features/benchmark/query";
import { minifyTypeProps } from "./src/features/download/query";
import { speedPresets } from "./src/features/download/speed";
import materialSymbols from "./vite/symbols";

const config = defineConfig({
  plugins: [
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart(),
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
          },
        },
      },
    ],
  },
});

export default config;
