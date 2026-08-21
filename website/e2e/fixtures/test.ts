import type { TestFixture, Page } from "@playwright/test";
import { test as baseTest } from "@playwright/test";

import { waitForFontsLoaded } from "#e2e/utils";

import * as components from "./components";
import * as pages from "./pages";

const objectModels = {
  ...components,
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
