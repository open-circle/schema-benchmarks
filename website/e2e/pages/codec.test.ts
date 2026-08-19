import { test } from "#e2e/fixtures";
import * as runtimeHelpers from "#e2e/helpers/runtime";

test.beforeEach(async ({ fontsLoaded, codecPage }) => {
  await codecPage.goto();

  await fontsLoaded();
});

test.describe("optimization filter", () => {
  test.describe("desktop", { tag: "@desktop" }, () => {
    test("can be filtered by optimization type", async ({ codecPage }) => {
      await runtimeHelpers.desktop.expectOptimizeFilter(codecPage);
    });
  });

  test.describe("mobile", { tag: "@mobile" }, () => {
    test("can be filtered by optimization type", async ({ codecPage }) => {
      await runtimeHelpers.mobile.expectOptimizeFilter(codecPage);
    });
  });
});

test.describe("desktop view", { tag: "@desktop" }, () => {
  test.beforeEach(async ({ codecPage }) => {
    await codecPage.desktop.tableHandle.init();
  });

  test("it displays results table", async ({ codecPage }) => {
    await runtimeHelpers.desktop.expectTableDisplay(codecPage);
  });

  test("table can be sorted by column", async ({ codecPage }) => {
    await runtimeHelpers.desktop.expectTableSorting(codecPage, {
      first: /effect/i,
      last: /zod/i,
    });
  });
});

test.describe("mobile view", { tag: "@mobile" }, () => {
  test("it displays results cards", async ({ codecPage }) => {
    await runtimeHelpers.mobile.expectCardDisplay(codecPage);
  });
});
