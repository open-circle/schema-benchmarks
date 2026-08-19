import { test } from "#e2e/fixtures";
import * as runtimeHelpers from "#e2e/helpers/runtime";

test.beforeEach(async ({ fontsLoaded, validationPage }) => {
  await validationPage.goto();

  await fontsLoaded();
});

test("can toggle between valid and invalid results", async ({ page, validationPage }) => {
  await runtimeHelpers.expectDataTypeToggle(page, validationPage);
});

test("can be filtered by optimization type", async ({ page, validationPage }) => {
  await runtimeHelpers.expectOptimizeFilter(page, validationPage);
});

test.describe("desktop view", () => {
  test.beforeEach("Check desktop view", async ({ matchBreakpoints, validationPage }) => {
    const isDesktop = await matchBreakpoints(validationPage.breakpoints.desktop);
    test.skip(!isDesktop, "This test is only for desktop viewports");

    await validationPage.desktop.tableHandle.init();
  });

  test("it displays results table", async ({ validationPage }) => {
    await runtimeHelpers.desktop.expectTableDisplay(validationPage);
  });

  test("table can be sorted by column", async ({ validationPage }) => {
    await runtimeHelpers.desktop.expectTableSorting(validationPage, {
      first: /@railway-ts/i,
      last: /zod/i,
    });
  });
});

test.describe("mobile view", () => {
  test.beforeEach("Check mobile view", async ({ matchBreakpoints, validationPage }) => {
    const isDesktop = await matchBreakpoints(validationPage.breakpoints.desktop);
    test.skip(isDesktop, "This test is only for mobile viewports");
  });

  test("it displays results cards", async ({ validationPage }) => {
    await runtimeHelpers.mobile.expectCardDisplay(validationPage);
  });
});
