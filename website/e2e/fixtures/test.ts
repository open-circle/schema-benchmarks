import type { TestFixture, Page } from "@playwright/test";
import { test as pwTest } from "@playwright/test";

import { waitForFontsLoaded } from "#e2e/utils";

interface UtilFixtures {
  fontsLoaded: () => Promise<void>;
}

const baseTest = pwTest.extend<UtilFixtures>({
  fontsLoaded: async ({ page }, use) => use(() => waitForFontsLoaded(page)),
});

baseTest.beforeEach("Mock external download APIs", async ({ context }) => {
  await context.route("https://api.npmjs.org/downloads/point/last-week/**", (route) =>
    route.fulfill({ json: { downloads: 0 } }),
  );

  await context.route("https://api.jsr.io/scopes/**/downloads", (route) =>
    route.fulfill({ json: { total: [] } }),
  );
});

export function createTest<ObjectModels extends Record<string, new (page: Page) => any>>(
  objectModels: ObjectModels,
) {
  const objectModelFixtures = Object.fromEntries(
    Object.entries(objectModels).map(
      ([name, POM]): [
        string,
        TestFixture<InstanceType<(typeof objectModels)[keyof typeof objectModels]>, { page: Page }>,
      ] => [name, ({ page }, use) => use(new POM(page))],
    ),
  ) as {
    [K in keyof ObjectModels]: TestFixture<InstanceType<ObjectModels[K]>, { page: Page }>;
  };

  return baseTest.extend<{ [K in keyof ObjectModels]: InstanceType<ObjectModels[K]> }>(
    objectModelFixtures,
  );
}
