import type { TestFixture, Page, PlaywrightTestArgs } from "@playwright/test";
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

export function createTest<Instances extends {}>(objectModels: {
  [K in keyof Instances]: new (page: Page) => Instances[K];
}) {
  return baseTest.extend<Instances>(
    Object.fromEntries(
      Object.entries<new (page: Page) => unknown>(objectModels).map(
        ([name, POM]): [string, TestFixture<unknown, PlaywrightTestArgs>] => [
          name,
          ({ page }, use) => use(new POM(page)),
        ],
      ),
    ) as never,
  );
}
