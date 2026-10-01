import "#src/shared/styles/index.css";
import { page } from "vite-plus/test/browser";

import { renderWithProviders } from "./render";

page.extend({ renderWithProviders });

declare module "vitest/browser" {
  interface BrowserPage {
    renderWithProviders: typeof renderWithProviders;
  }
}
