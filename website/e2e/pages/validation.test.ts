import { dataTypeSchema } from "@schema-benchmarks/bench";

import { test, expect } from "#e2e/fixtures";
import * as runtimeHelpers from "#e2e/helpers/runtime";

test.beforeEach(async ({ page, fontsLoaded }) => {
  await page.goto("/validation");

  await fontsLoaded();

  await expect(page).toHaveTitle(/Validation/);
});

test("can toggle between valid and invalid results", async ({ page, validationPage }) => {
  for (const dataType of dataTypeSchema.options) {
    const dataTypeLink = validationPage.getDataTypeLink(dataType);

    await dataTypeLink.click();

    await expect(page).toHaveURL((url) => url.searchParams.get("dataType") === dataType);

    await expect(dataTypeLink).toBeCurrent("page");
  }
});

test("can be filtered by optimization type", async ({ page, validationPage }) => {
  await runtimeHelpers.testOptimizeFilter(page, validationPage);
});

test.describe("desktop view", () => {
  test.beforeEach("Check desktop view", async ({ matchBreakpoints, validationPage }) => {
    const isDesktop = await matchBreakpoints(validationPage.breakpoints.desktop);
    test.skip(!isDesktop, "This test is only for desktop viewports");
  });

  test("it displays results table", async ({ validationPage }) => {
    await runtimeHelpers.desktop.testTableDisplay(validationPage);
  });

  test("table can be sorted by column", async ({ validationPage }) => {
    await runtimeHelpers.desktop.testTableSorting(validationPage, {
      first: /@railway-ts/i,
      last: /yup/i,
    });
  });
});

test.describe("mobile view", () => {
  test.beforeEach("Check mobile view", async ({ matchBreakpoints, validationPage }) => {
    const isDesktop = await matchBreakpoints(validationPage.breakpoints.desktop);
    test.skip(isDesktop, "This test is only for mobile viewports");
  });

  test("it displays results cards", async ({ validationPage }) => {
    await runtimeHelpers.mobile.testCardDisplay(validationPage);
  });
});
