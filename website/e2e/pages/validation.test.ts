import { test } from "#e2e/fixtures";
import * as runtimeHelpers from "#e2e/helpers/runtime";

test.beforeEach(async ({ fontsLoaded, validationPage }) => {
  await validationPage.goto();

  await fontsLoaded();
});

test("can toggle between valid and invalid results", async ({ page, validationPage }) => {
  await runtimeHelpers.expectDataTypeToggle(page, validationPage);
});

test.describe("optimization filter", () => {
  test.describe("desktop", { tag: "@desktop" }, () => {
    test("can be filtered by optimization type", async ({ validationPage }) => {
      await runtimeHelpers.desktop.expectOptimizeFilter(validationPage);
    });
  });

  test.describe("mobile", { tag: "@mobile" }, () => {
    test("can be filtered by optimization type", async ({ validationPage }) => {
      await runtimeHelpers.mobile.expectOptimizeFilter(validationPage);
    });
  });
});

test.describe("desktop view", { tag: "@desktop" }, () => {
  test.beforeEach(async ({ validationPage }) => {
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

test.describe("mobile view", { tag: "@mobile" }, () => {
  test("it displays results cards", async ({ validationPage }) => {
    await runtimeHelpers.mobile.expectCardDisplay(validationPage);
  });
});
