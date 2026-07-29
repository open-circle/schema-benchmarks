import { stringFormatSchema } from "@schema-benchmarks/schemas";

import { test, expect } from "#e2e/fixtures";
import * as runtimeHelpers from "#e2e/helpers/runtime";
import { yup } from "#e2e/utils/libraries";

test.beforeEach(async ({ page, fontsLoaded, stringPage }) => {
  await stringPage.goto();

  await fontsLoaded();

  await expect(page).toHaveTitle(/String/);
});

test("can toggle between string formats", async ({ page, stringPage }) => {
  for (const format of stringFormatSchema.options) {
    const formatLink = stringPage.getFormatLink(format);

    await formatLink.click();

    await expect(page).toHaveURL((url) => url.searchParams.get("stringFormat") === format);

    await expect(formatLink).toBeCurrent("page");
  }
});

test("can toggle between valid and invalid results", async ({ page, stringPage }) => {
  await runtimeHelpers.testDataTypeToggle(page, stringPage);
});

test("can be filtered by optimization type", async ({ page, stringPage }) => {
  await runtimeHelpers.testOptimizeFilter(page, stringPage);
});

test.describe("desktop view", () => {
  test.beforeEach("Check desktop view", async ({ matchBreakpoints, stringPage }) => {
    const isDesktop = await matchBreakpoints(stringPage.breakpoints.desktop);
    test.skip(!isDesktop, "This test is only for desktop viewports");

    await stringPage.desktop.tableHandle.init();
  });

  test("it displays results table", async ({ stringPage }) => {
    await runtimeHelpers.desktop.testTableDisplay(stringPage, yup);
  });

  test("table can be sorted by column", async ({ stringPage }) => {
    await runtimeHelpers.desktop.testTableSorting(stringPage, {
      first: /@paseri/i,
      last: /zod/i,
    });
  });
});

test.describe("mobile view", () => {
  test.beforeEach("Check mobile view", async ({ matchBreakpoints, stringPage }) => {
    const isDesktop = await matchBreakpoints(stringPage.breakpoints.desktop);
    test.skip(isDesktop, "This test is only for mobile viewports");
  });

  test("it displays results cards", async ({ stringPage }) => {
    await runtimeHelpers.mobile.testCardDisplay(stringPage, yup);
  });
});
