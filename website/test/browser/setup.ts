import "#src/shared/styles/index.css";
import { network } from "virtual:msw";
import { page } from "vite-plus/test/browser";

import { renderWithProviders } from "./render";

page.extend({ renderWithProviders });

declare module "vitest/browser" {
  interface BrowserPage {
    renderWithProviders: typeof renderWithProviders;
  }
}

await network.enable();
