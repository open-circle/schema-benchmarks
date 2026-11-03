import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

import type { Browser, BrowserContext, BrowserContextOptions, Page } from "playwright";
import { chromium, firefox, webkit } from "playwright";
import { inject, test as baseTest } from "vite-plus/test";
import type { TestAPI } from "vite-plus/test";

import { runStep, stepContext } from "#e2e/fixtures/base";
import { waitForFontsLoaded } from "#e2e/utils";

export { expect } from "./expect";

interface E2EOptions {
  browser: "chromium" | "firefox" | "webkit";
  contextOptions: BrowserContextOptions;
}

declare module "vitest" {
  interface ProvidedContext {
    e2e: E2EOptions;
  }
}

interface E2EFixtures {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  fontsLoaded: () => Promise<void>;
}

const test = baseTest.extend<E2EFixtures>({
  browser: [
    async ({}, provide) => {
      const { browser: browserName } = inject("e2e");
      const browser = await { chromium, firefox, webkit }[browserName].launch({
        headless: process.env.HEADLESS !== "false",
        ...(browserName === "chromium" ? { channel: "chromium" } : {}),
      });
      try {
        await provide(browser);
      } finally {
        await browser.close();
      }
    },
    { scope: "worker" },
  ],
  context: async ({ browser, task }, provide) => {
    const context = await browser.newContext(inject("e2e").contextOptions);
    try {
      await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
      await context.route("https://api.npmjs.org/downloads/point/last-week/**", (route) =>
        route.fulfill({ json: { downloads: 0 } }),
      );
      await context.route("https://api.jsr.io/scopes/**/downloads", (route) =>
        route.fulfill({ json: { total: [] } }),
      );
      await provide(context);
    } finally {
      try {
        if (task.result?.state === "fail") {
          const directory = resolve("test-results/vitest-e2e", task.id, crypto.randomUUID());
          await mkdir(directory, { recursive: true });
          const page = context.pages()[0];
          try {
            if (page && !page.isClosed()) {
              const screenshot = resolve(directory, "failure.png");
              await page.screenshot({ path: screenshot, timeout: 5_000 });
            }
          } finally {
            const trace = resolve(directory, "trace.zip");
            await context.tracing.stop({ path: trace });
            console.error(`E2E failure artifacts: ${directory}`);
          }
        } else {
          await context.tracing.stop();
        }
      } finally {
        await context.close();
      }
    }
  },
  page: async ({ context }, provide) => {
    const page = await context.newPage();
    page.setDefaultTimeout(30_000);
    page.setDefaultNavigationTimeout(30_000);
    await provide(page);
  },
  fontsLoaded: async ({ page }, provide) => provide(() => waitForFontsLoaded(page)),
});

export function createTest<Models extends Record<string, new (page: Page) => unknown>>(
  models: Models,
): TestAPI<E2EFixtures & { [Key in keyof Models]: InstanceType<Models[Key]> }> & {
  step: typeof runStep;
} {
  const extended = test.extend<{ [Key in keyof Models]: InstanceType<Models[Key]> }>(
    Object.fromEntries(
      Object.entries(models).map(([name, Model]) => [
        name,
        async ({ page }: E2EFixtures, provide: (model: unknown) => Promise<void>) =>
          provide(new Model(page)),
      ]),
    ) as never,
  );
  extended.aroundEach(async (runTest, { annotate }) => {
    await stepContext.run(async (title) => {
      await annotate(title, "step");
    }, runTest);
  });
  return Object.assign(extended, { step: runStep }) as TestAPI<
    E2EFixtures & { [Key in keyof Models]: InstanceType<Models[Key]> }
  > & { step: typeof runStep };
}
