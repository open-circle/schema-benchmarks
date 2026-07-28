import { test, expect } from "#e2e/fixtures";
import * as runtimeHelpers from "#e2e/helpers/runtime";

const library = {
  name: "yup",
  version: "1.7.1",
};

test.beforeEach(async ({ page, fontsLoaded }) => {
  await page.goto("/standard");

  await fontsLoaded();

  await expect(page).toHaveTitle(/Standard Schema/);
});

test("can toggle between valid and invalid results", async ({ page, standardSchemaPage }) => {
  await runtimeHelpers.testDataTypeToggle(page, standardSchemaPage);
});

test("can be filtered by optimization type", async ({ page, standardSchemaPage }) => {
  await runtimeHelpers.testOptimizeFilter(page, standardSchemaPage);
});

test("can be filtered by error type", async ({ page, standardSchemaPage }) => {
  await runtimeHelpers.testErrorTypeFilter(page, standardSchemaPage);
});

test.describe("desktop view", () => {
  test.beforeEach("Check desktop view", async ({ matchBreakpoints, standardSchemaPage }) => {
    const isDesktop = await matchBreakpoints(standardSchemaPage.breakpoints.desktop);
    test.skip(!isDesktop, "This test is only for desktop viewports");
  });

  test("it displays results table", async ({ standardSchemaPage }) => {
    await runtimeHelpers.desktop.testTableDisplay(standardSchemaPage, library);
  });

  test("table can be sorted by column", async ({ standardSchemaPage }) => {
    await runtimeHelpers.desktop.testTableSorting(standardSchemaPage, {
      first: /@paseri/i,
      last: /zod/i,
    });
  });
});

test.describe("mobile view", () => {
  test.beforeEach("Check mobile view", async ({ matchBreakpoints, standardSchemaPage }) => {
    const isDesktop = await matchBreakpoints(standardSchemaPage.breakpoints.desktop);
    test.skip(isDesktop, "This test is only for mobile viewports");
  });

  test("it displays results cards", async ({ standardSchemaPage }) => {
    await runtimeHelpers.mobile.testCardDisplay(standardSchemaPage, library);
  });
});
