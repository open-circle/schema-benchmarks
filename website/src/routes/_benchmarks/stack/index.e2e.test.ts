import { createTest, expect } from "#e2e/fixtures";
import * as helpers from "#e2e/helpers";

import { StackPage } from "./index.e2e.model";

const test = createTest({ stackPage: StackPage });

test.beforeEach("Go to stack page", async ({ fontsLoaded, stackPage }) => {
  await stackPage.goto();

  await fontsLoaded();
});

test.describe("desktop view", { tag: "@desktop" }, () => {
  test.beforeEach(async ({ stackPage }) => {
    await expect(stackPage.desktop.table).toBeVisible();
    await stackPage.desktop.tableHandle.init();
  });

  test("it displays results table", async ({ stackPage }) => {
    await expect(stackPage.desktop.table).toBeVisible();
    await expect(
      stackPage.desktop.tableHandle.getRow({ library: "@paseri/compiler" }),
    ).toBeVisible();
  });

  test("table can be sorted by column", async ({ stackPage }) => {
    await helpers.desktop.expectTableSorting(stackPage.desktop.tableHandle, {
      first: /@paseri\/compiler/i,
      last: /zod/i,
    });
  });
});

test.describe("mobile view", { tag: "@mobile" }, () => {
  test("it displays result list and expands details", async ({ stackPage }) => {
    const item = stackPage.mobile.getListItemByLibraryName("@paseri/compiler").first();
    const details = item.locator("details");

    await item.scrollIntoViewIfNeeded();
    await expect(item).toBeVisible();

    await details.locator("summary").click();
    await expect(details).toHaveAttribute("open", "");
    await expect(details.getByText("Output", { exact: true })).toBeVisible();
  });
});
