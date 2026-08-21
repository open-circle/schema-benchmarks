import type { TestFixture, Page } from "@playwright/test";
import { test as baseTest } from "@playwright/test";

import { waitForFontsLoaded } from "#e2e/utils";

import { Header } from "./header";
import * as pages from "./pages";
import { PrefsDialog } from "./prefs";
import { Sidebar } from "./sidebar";

const objectModels = {
  sidebar: Sidebar,
  header: Header,
  prefs: PrefsDialog,
  ...pages,
} satisfies Record<string, new (page: Page) => unknown>;

type ObjectModelFixtures = {
  [K in keyof typeof objectModels]: InstanceType<(typeof objectModels)[K]>;
};

const objectModelFixtures = Object.fromEntries(
  Object.entries(objectModels).map(
    ([name, POM]): [
      string,
      TestFixture<ObjectModelFixtures[keyof ObjectModelFixtures], { page: Page }>,
    ] => [name, ({ page }, use) => use(new POM(page))],
  ),
) as {
  [K in keyof ObjectModelFixtures]: TestFixture<ObjectModelFixtures[K], { page: Page }>;
};

interface UtilFixtures {
  fontsLoaded: () => Promise<void>;
}

export const test = baseTest.extend<ObjectModelFixtures & UtilFixtures>({
  ...objectModelFixtures,
  fontsLoaded: async ({ page }, use) => use(() => waitForFontsLoaded(page)),
});
