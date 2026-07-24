import { test, expect } from "#e2e/fixtures";
import * as runtimeHelpers from "#e2e/helpers/runtime";

test.beforeEach(async ({ page, fontsLoaded, matchBreakpoints, codecPage }) => {
  await page.goto("/codec");

  await fontsLoaded();

  await expect(page).toHaveTitle(/Codec/);

  // opening text on this page is hefty, so we need to scroll down to the table or cards list

  const isDesktop = await matchBreakpoints(codecPage.breakpoints.desktop);
  const results = isDesktop ? codecPage.desktop.table : codecPage.mobile.cardsList;

  await expect(results).toBeVisible();
  await results.scrollIntoViewIfNeeded();
});

test("can be filtered by optimization type", async ({ page, codecPage }) => {
  await runtimeHelpers.testOptimizeFilter(page, codecPage);
});

test.describe("desktop view", () => {
  test.beforeEach("Check desktop view", async ({ matchBreakpoints, codecPage }) => {
    const isDesktop = await matchBreakpoints(codecPage.breakpoints.desktop);
    test.skip(!isDesktop, "This test is only for desktop viewports");
  });

  test("it displays results table", async ({ codecPage }) => {
    await runtimeHelpers.desktop.testTableDisplay(codecPage);
  });

  test("table can be sorted by column", async ({ codecPage }) => {
    await runtimeHelpers.desktop.testTableSorting(codecPage, {
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
    await runtimeHelpers.mobile.testCardDisplay(codecPage);
  });
});
