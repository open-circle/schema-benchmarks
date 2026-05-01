import * as fs from "node:fs/promises";
import * as path from "node:path";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";
import { build, createServer } from "vite-plus";
import type { UserConfig } from "vite-plus";

import vitePwaOpts from "./opts.ts";
import type * as rootModule from "./root";

const sharedOpts = {
  resolve: {
    alias: {
      "#/": "/src/",
    },
  },
} satisfies Partial<UserConfig>;

// step 1: create base HTML and service worker
await build({
  ...sharedOpts,
  configFile: false,
  build: {
    rolldownOptions: {
      input: path.resolve(process.cwd(), "./offline/index.html"),
    },
    outDir: path.resolve(process.cwd(), "./dist/client"),
    emptyOutDir: false,
    sourcemap: true,
  },
  plugins: [
    VitePWA({
      ...vitePwaOpts,
      injectRegister: false,
    }),
  ],
});

// step 2: render React root into the placeholder
const htmlFile = path.resolve(process.cwd(), "./dist/client/offline/index.html");
const rootPlaceholder = `<div id="root"></div>`;

const vite = await createServer({
  ...sharedOpts,
  appType: "custom",
  configFile: false,
  logLevel: "error",
  server: {
    middlewareMode: true,
  },
  plugins: [svgr()],
});

try {
  const { default: Root } = (await vite.ssrLoadModule("/offline/root.tsx")) as typeof rootModule;
  const rootHtml = renderToStaticMarkup(createElement(Root));
  const html = await fs.readFile(htmlFile, "utf8");

  if (!html.includes(rootPlaceholder)) {
    throw new Error(`Expected to find ${rootPlaceholder} in ${htmlFile}`);
  }

  await fs.writeFile(htmlFile, html.replace(rootPlaceholder, rootHtml));
} finally {
  await vite.close();
}
