import { test } from "#e2e/fixtures";
import * as runtimeHelpers from "#e2e/helpers/runtime";

test.beforeEach(async ({ fontsLoaded, initializationPage }) => {
  await initializationPage.goto();

  await fontsLoaded();
});

test.describe("optimization filter", () => {
  test.describe("desktop", { tag: "@desktop" }, () => {
    test("can be filtered by optimization type", async ({ initializationPage }) => {
      await runtimeHelpers.desktop.expectOptimizeFilter(initializationPage);
    });
  });

  test.describe("mobile", { tag: "@mobile" }, () => {
    test("can be filtered by optimization type", async ({ initializationPage }) => {
      await runtimeHelpers.mobile.expectOptimizeFilter(initializationPage);
    });
  });
});

test.describe("desktop view", { tag: "@desktop" }, () => {
  test.beforeEach(async ({ initializationPage }) => {
    await initializationPage.desktop.tableHandle.init();
  });

  test("it displays results table", async ({ initializationPage }) => {
    await runtimeHelpers.desktop.expectTableDisplay(initializationPage);
  });

  test("table can be sorted by column", async ({ initializationPage }) => {
    await runtimeHelpers.desktop.expectTableSorting(initializationPage, {
      first: /@paseri/i,
      last: /zod/i,
    });
  });
});

test.describe("mobile view", { tag: "@mobile" }, () => {
  test("it displays results cards", async ({ initializationPage }) => {
    await runtimeHelpers.mobile.expectCardDisplay(initializationPage);
  });
});
