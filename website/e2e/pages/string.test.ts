import { stringFormatSchema } from "@schema-benchmarks/schemas";

import { test, expect } from "#e2e/fixtures";
import * as runtimeHelpers from "#e2e/helpers/runtime";
import { yup } from "#e2e/utils/libraries";

test.beforeEach(async ({ fontsLoaded, stringPage }) => {
  await stringPage.goto();

  await fontsLoaded();
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
  await runtimeHelpers.expectDataTypeToggle(page, stringPage);
});

test.describe("optimization filter", () => {
  test.describe("desktop", { tag: "@desktop" }, () => {
    test("can be filtered by optimization type", async ({ stringPage }) => {
      await runtimeHelpers.desktop.expectOptimizeFilter(stringPage);
    });
  });

  test.describe("mobile", { tag: "@mobile" }, () => {
    test("can be filtered by optimization type", async ({ stringPage }) => {
      await runtimeHelpers.mobile.expectOptimizeFilter(stringPage);
    });
  });
});

test.describe("desktop view", { tag: "@desktop" }, () => {
  test.beforeEach(async ({ stringPage }) => {
    await stringPage.desktop.tableHandle.init();
  });

  test("it displays results table", async ({ stringPage }) => {
    await runtimeHelpers.desktop.expectTableDisplay(stringPage, yup);
  });

  test("table can be sorted by column", async ({ stringPage }) => {
    await runtimeHelpers.desktop.expectTableSorting(stringPage, {
      first: /@paseri/i,
      last: /zod/i,
    });
  });
});

test.describe("mobile view", { tag: "@mobile" }, () => {
  test("it displays results cards", async ({ stringPage }) => {
    await runtimeHelpers.mobile.expectCardDisplay(stringPage, yup);
  });
});
