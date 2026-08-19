import { test } from "#e2e/fixtures";
import * as helpers from "#e2e/helpers";

test.beforeEach(async ({ fontsLoaded, codecPage }) => {
  await codecPage.goto();

  await fontsLoaded();
});

test.describe("optimization filter", () => {
  test.describe("desktop", { tag: "@desktop" }, () => {
    test("can be filtered by optimization type", async ({ codecPage }) => {
      await helpers.runtime.desktop.expectOptimizeFilter(codecPage);
    });
  });

  test.describe("mobile", { tag: "@mobile" }, () => {
    test("can be filtered by optimization type", async ({ codecPage }) => {
      await helpers.runtime.mobile.expectOptimizeFilter(codecPage);
    });
  });
});

test.describe("desktop view", { tag: "@desktop" }, () => {
  test.beforeEach(async ({ codecPage }) => {
    await codecPage.desktop.tableHandle.init();
  });

  test("it displays results table", async ({ codecPage }) => {
    await helpers.runtime.desktop.expectTableDisplay(codecPage);
  });

  test("table can be sorted by column", async ({ codecPage }) => {
    await helpers.desktop.expectTableSorting(codecPage.desktop.tableHandle, {
      first: /effect/i,
      last: /zod/i,
    });
  });
});

test.describe("mobile view", { tag: "@mobile" }, () => {
  test("it displays results cards", async ({ codecPage }) => {
    await helpers.runtime.mobile.expectCardDisplay(codecPage);
  });
});
