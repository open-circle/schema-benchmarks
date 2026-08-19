import { test } from "#e2e/fixtures";
import * as runtimeHelpers from "#e2e/helpers/runtime";

test.beforeEach(async ({ fontsLoaded, parsingPage }) => {
  await parsingPage.goto();

  await fontsLoaded();
});

test("can toggle between valid and invalid results", async ({ page, parsingPage }) => {
  await runtimeHelpers.expectDataTypeToggle(page, parsingPage);
});

test.describe("optimization filter", () => {
  test.describe("desktop", { tag: "@desktop" }, () => {
    test("can be filtered by optimization type", async ({ parsingPage }) => {
      await runtimeHelpers.desktop.expectOptimizeFilter(parsingPage);
    });
  });

  test.describe("mobile", { tag: "@mobile" }, () => {
    test("can be filtered by optimization type", async ({ parsingPage }) => {
      await runtimeHelpers.mobile.expectOptimizeFilter(parsingPage);
    });
  });
});

test.describe("error type filter", () => {
  test.describe("desktop", { tag: "@desktop" }, () => {
    test("can be filtered by error type", async ({ parsingPage }) => {
      await runtimeHelpers.desktop.expectErrorTypeFilter(parsingPage);
    });
  });

  test.describe("mobile", { tag: "@mobile" }, () => {
    test("can be filtered by error type", async ({ parsingPage }) => {
      await runtimeHelpers.mobile.expectErrorTypeFilter(parsingPage);
    });
  });
});

test.describe("desktop view", { tag: "@desktop" }, () => {
  test.beforeEach(async ({ parsingPage }) => {
    await parsingPage.desktop.tableHandle.init();
  });

  test("it displays results table", async ({ parsingPage }) => {
    await runtimeHelpers.desktop.expectTableDisplay(parsingPage);
  });

  test("table can be sorted by column", async ({ parsingPage }) => {
    await runtimeHelpers.desktop.expectTableSorting(parsingPage, {
      first: /@paseri/i,
      last: /zod/i,
    });
  });
});

test.describe("mobile view", { tag: "@mobile" }, () => {
  test("it displays results cards", async ({ parsingPage }) => {
    await runtimeHelpers.mobile.expectCardDisplay(parsingPage);
  });
});
