import "#/shared/styles/index.css";
import { renderHook } from "vitest-browser-react";
import { page } from "vitest/browser";

import { renderWithProviders } from "./render";

page.extend({
  renderWithProviders,
  renderHook,
});

declare module "vitest/browser" {
  interface BrowserPage {
    renderWithProviders: typeof renderWithProviders;
    renderHook: typeof renderHook;
  }
}
