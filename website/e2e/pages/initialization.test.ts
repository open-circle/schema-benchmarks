import { test, expect } from "#e2e/fixtures";
import * as runtimeHelpers from "#e2e/helpers/runtime";

test.beforeEach(async ({ page, fontsLoaded }) => {
  await page.goto("/initialization");

  await fontsLoaded();

  await expect(page).toHaveTitle(/Initialization/);
});

test("can be filtered by optimization type", async ({ page, initializationPage }) => {
  await runtimeHelpers.testOptimizeFilter(page, initializationPage);
});

test.describe("desktop view", () => {
  test.beforeEach("Check desktop view", async ({ matchBreakpoints, initializationPage }) => {
    const isDesktop = await matchBreakpoints(initializationPage.breakpoints.desktop);
    test.skip(!isDesktop, "This test is only for desktop viewports");
  });

  test("it displays results table", async ({ initializationPage }) => {
    await runtimeHelpers.desktop.testTableDisplay(initializationPage);
  });

  test("table can be sorted by column", async ({ initializationPage }) => {
    await runtimeHelpers.desktop.testTableSorting(initializationPage, {
      first: /@paseri/i,
      last: /zod/i,
    });
  });
});

test.describe("mobile view", () => {
  test.beforeEach("Check mobile view", async ({ matchBreakpoints, initializationPage }) => {
    const isDesktop = await matchBreakpoints(initializationPage.breakpoints.desktop);
    test.skip(isDesktop, "This test is only for mobile viewports");
  });

  test("it displays results cards", async ({ initializationPage }) => {
    await runtimeHelpers.mobile.testCardDisplay(initializationPage);
  });
});
