import { test, expect } from "#e2e/fixtures";
import * as helpers from "#e2e/helpers";

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
  test("it displays result cards and expands output", async ({ stackPage }) => {
    const card = stackPage.mobile.getCardByLibraryName("@paseri/compiler");
    const output = card.locator("details");

    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();

    await card.getByText("Output").click();
    await expect(output).toHaveAttribute("open", "");
  });
});
