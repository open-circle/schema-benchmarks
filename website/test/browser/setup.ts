import "vitest-browser-react";
import "#/shared/styles/index.css";
import { page } from "vite-plus/test/browser";

import { renderWithProviders } from "./render";

page.extend({
  renderWithProviders,
});

declare module "vite-plus/test/browser" {
  interface BrowserPage {
    renderWithProviders: typeof renderWithProviders;
  }
}
