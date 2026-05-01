import "vitest-browser-react";
import "#/shared/styles/index.css";
import { page } from "vite-plus/test/browser";
import { renderHook } from "vitest-browser-react";

import { renderWithProviders } from "./render";

page.extend({
  renderWithProviders,
  renderHook,
});

declare module "vite-plus/test/browser" {
  interface BrowserPage {
    renderWithProviders: typeof renderWithProviders;
    renderHook: typeof renderHook;
  }
}
