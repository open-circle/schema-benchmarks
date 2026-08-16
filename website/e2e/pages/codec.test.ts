import { test, expect } from "#e2e/fixtures";
import * as runtimeHelpers from "#e2e/helpers/runtime";

test.beforeEach(async ({ page, fontsLoaded, codecPage }) => {
  await codecPage.goto();

  await fontsLoaded();

  await expect(page).toHaveTitle(/Codec/);
});

test("can be filtered by optimization type", async ({ page, codecPage }) => {
  await runtimeHelpers.expectOptimizeFilter(page, codecPage);
});

test.describe("desktop view", () => {
  test.beforeEach("Check desktop view", async ({ matchBreakpoints, codecPage }) => {
    const isDesktop = await matchBreakpoints(codecPage.breakpoints.desktop);
    test.skip(!isDesktop, "This test is only for desktop viewports");

    await codecPage.desktop.tableHandle.init();
  });

  test("it displays results table", async ({ codecPage }) => {
    await runtimeHelpers.desktop.expectTableDisplay(codecPage);
  });

  test("table can be sorted by column", async ({ codecPage }) => {
    await runtimeHelpers.desktop.expectTableSorting(codecPage, {
      first: /effect/i,
      last: /zod/i,
    });
  });
});

test.describe("mobile view", () => {
  test.beforeEach("Check mobile view", async ({ matchBreakpoints, codecPage }) => {
    const isDesktop = await matchBreakpoints(codecPage.breakpoints.desktop);
    test.skip(isDesktop, "This test is only for mobile viewports");
  });

  test("it displays results cards", async ({ codecPage }) => {
    await runtimeHelpers.mobile.expectCardDisplay(codecPage);
  });
});
