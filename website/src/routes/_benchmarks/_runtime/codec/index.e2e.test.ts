import { createTest, expect } from "#e2e/fixtures";
import * as helpers from "#e2e/helpers";

import { CodecPage } from "./index.e2e.model";

const test = createTest({ codecPage: CodecPage });

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
  test("it displays results list", async ({ codecPage }) => {
    await helpers.runtime.mobile.expectCardDisplay(codecPage);
  });

  test("it can expand a result for codec details", async ({ codecPage }) => {
    const details = codecPage.mobile.getDetailsByLibraryName("sury").first();
    await details.scrollIntoViewIfNeeded();

    await details.locator("summary").click();

    await expect(details.getByText("Encode", { exact: true }).first()).toBeVisible();
    await expect(details.getByText("Decode", { exact: true }).first()).toBeVisible();
  });
});
