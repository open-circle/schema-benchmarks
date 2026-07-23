import { test, expect } from "#e2e/fixtures";
import * as runtimeHelpers from "#e2e/helpers/runtime";

test.beforeEach(async ({ page, fontsLoaded }) => {
  await page.goto("/parsing");

  await fontsLoaded();

  await expect(page).toHaveTitle(/Parsing/);
});

test("can toggle between valid and invalid results", async ({ page, parsingPage }) => {
  await runtimeHelpers.testDataTypeToggle(page, parsingPage);
});

test("can be filtered by optimization type", async ({ page, parsingPage }) => {
  await runtimeHelpers.testOptimizeFilter(page, parsingPage);
});

test("can be filtered by error type", async ({ page, parsingPage }) => {
  await runtimeHelpers.testErrorTypeFilter(page, parsingPage);
});

test.describe("desktop view", () => {
  test.beforeEach("Check desktop view", async ({ matchBreakpoints, parsingPage }) => {
    const isDesktop = await matchBreakpoints(parsingPage.breakpoints.desktop);
    test.skip(!isDesktop, "This test is only for desktop viewports");
  });

  test("it displays results table", async ({ parsingPage }) => {
    await runtimeHelpers.desktop.testTableDisplay(parsingPage);
  });

  test("table can be sorted by column", async ({ parsingPage }) => {
    await runtimeHelpers.desktop.testTableSorting(parsingPage, {
      first: /@paseri/i,
      last: /zod/i,
    });
  });
});

test.describe("mobile view", () => {
  test.beforeEach("Check mobile view", async ({ matchBreakpoints, parsingPage }) => {
    const isDesktop = await matchBreakpoints(parsingPage.breakpoints.desktop);
    test.skip(isDesktop, "This test is only for mobile viewports");
  });

  test("it displays results cards", async ({ parsingPage }) => {
    await runtimeHelpers.mobile.testCardDisplay(parsingPage);
  });
});
