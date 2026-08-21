import { createTest } from "#e2e/fixtures";
import { InitializationPage } from "#e2e/fixtures/pages/initialization.ts";
import * as helpers from "#e2e/helpers";

const test = createTest({ initializationPage: InitializationPage });

test.beforeEach(async ({ fontsLoaded, initializationPage }) => {
  await initializationPage.goto();

  await fontsLoaded();
});

test.describe("optimization filter", () => {
  test.describe("desktop", { tag: "@desktop" }, () => {
    test("can be filtered by optimization type", async ({ initializationPage }) => {
      await helpers.runtime.desktop.expectOptimizeFilter(initializationPage);
    });
  });

  test.describe("mobile", { tag: "@mobile" }, () => {
    test("can be filtered by optimization type", async ({ initializationPage }) => {
      await helpers.runtime.mobile.expectOptimizeFilter(initializationPage);
    });
  });
});

test.describe("desktop view", { tag: "@desktop" }, () => {
  test.beforeEach(async ({ initializationPage }) => {
    await initializationPage.desktop.tableHandle.init();
  });

  test("it displays results table", async ({ initializationPage }) => {
    await helpers.runtime.desktop.expectTableDisplay(initializationPage);
  });

  test("table can be sorted by column", async ({ initializationPage }) => {
    await helpers.desktop.expectTableSorting(initializationPage.desktop.tableHandle, {
      first: /@paseri/i,
      last: /zod/i,
    });
  });
});

test.describe("mobile view", { tag: "@mobile" }, () => {
  test("it displays results cards", async ({ initializationPage }) => {
    await helpers.runtime.mobile.expectCardDisplay(initializationPage);
  });
});
