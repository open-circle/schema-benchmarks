import "vitest-browser-react";
import "../../src/shared/styles/index.css";
import { page } from "vitest/browser";
import { renderWithProviders } from "./render";

page.extend({
  renderWithProviders,
});

declare module "vitest/browser" {
  interface BrowserPage {
    renderWithProviders: typeof renderWithProviders;
  }
}
