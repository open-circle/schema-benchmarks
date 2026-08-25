import { stringFormatSchema } from "@schema-benchmarks/schemas";

import { createTest, expect } from "#e2e/fixtures";
import * as helpers from "#e2e/helpers";

import { StringPage } from "./index.e2e.model";

const test = createTest({ stringPage: StringPage });

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
  await helpers.runtime.expectDataTypeToggle(page, stringPage);
});

test.describe("optimization filter", () => {
  test.describe("desktop", { tag: "@desktop" }, () => {
    test("can be filtered by optimization type", async ({ stringPage }) => {
      await helpers.runtime.desktop.expectOptimizeFilter(stringPage);
    });
  });

  test.describe("mobile", { tag: "@mobile" }, () => {
    test("can be filtered by optimization type", async ({ stringPage }) => {
      await helpers.runtime.mobile.expectOptimizeFilter(stringPage);
    });
  });
});

test.describe("desktop view", { tag: "@desktop" }, () => {
  test.beforeEach(async ({ stringPage }) => {
    await stringPage.desktop.tableHandle.init();
  });

  test("it displays results table", async ({ stringPage }) => {
    await helpers.runtime.desktop.expectTableDisplay(stringPage);
  });

  test("table can be sorted by column", async ({ stringPage }) => {
    await helpers.desktop.expectTableSorting(stringPage.desktop.tableHandle, {
      first: /@paseri/i,
      last: /zod/i,
    });
  });
});

test.describe("mobile view", { tag: "@mobile" }, () => {
  test("it displays results list items", async ({ stringPage }) => {
    await helpers.runtime.mobile.expectListDisplay(stringPage);
  });
});
