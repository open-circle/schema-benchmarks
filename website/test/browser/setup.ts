import "#src/shared/styles/index.css";
import { network } from "virtual:msw";
import { beforeAll, afterEach, afterAll } from "vite-plus/test";
import { page } from "vite-plus/test/browser";

import { renderWithProviders } from "./render";

page.extend({ renderWithProviders });

declare module "vitest/browser" {
  interface BrowserPage {
    renderWithProviders: typeof renderWithProviders;
  }
}

beforeAll(() => network.enable());
afterEach(() => network.resetHandlers());
afterAll(() => network.disable());
