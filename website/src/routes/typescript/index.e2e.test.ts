import { createTest, expect } from "#e2e/fixtures";
import * as helpers from "#e2e/helpers";

import { TypescriptPage } from "./index.e2e.model";

const test = createTest({ typescriptPage: TypescriptPage });

test.beforeEach("Go to TypeScript page", async ({ fontsLoaded, typescriptPage }) => {
  await typescriptPage.goto();

  await fontsLoaded();
});

test.describe("desktop view", { tag: "@desktop" }, () => {
  test.beforeEach(async ({ typescriptPage }) => {
    await expect(typescriptPage.desktop.table).toBeVisible();
    await typescriptPage.desktop.tableHandle.init();
  });

  test("it displays results table", async ({ typescriptPage }) => {
    await expect(typescriptPage.desktop.tableHandle.getRow({ library: "typia" })).toBeVisible();
  });

  test("table can be sorted by column", async ({ typescriptPage }) => {
    await helpers.desktop.expectTableSorting(typescriptPage.desktop.tableHandle, {
      first: /@paseri\/paseri/i,
      last: /zod\/v3/i,
    });
  });

  test("it opens the inferred types of a library", async ({ typescriptPage }) => {
    await typescriptPage.desktop.tableHandle
      .getRow({ library: "typia" })
      .getByRole("link", { name: "Open details" })
      .click();

    await expect(typescriptPage.details.dialog).toBeVisible();
    await expect(typescriptPage.details.dialog.getByText("Type on hover")).toBeVisible();

    await typescriptPage.details.close();
    await expect(typescriptPage.details.dialog).toBeHidden();
  });
});

test.describe("mobile view", { tag: "@mobile" }, () => {
  test("it displays the result list", async ({ typescriptPage }) => {
    const item = typescriptPage.mobile.getListItemByLibraryName("typia").first();

    await item.scrollIntoViewIfNeeded();
    await expect(item).toBeVisible();
    await expect(item).toContainText("instantiations");
  });
});
