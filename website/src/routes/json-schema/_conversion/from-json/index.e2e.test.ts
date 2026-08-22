import { createTest, expect } from "#e2e/fixtures";
import * as helpers from "#e2e/helpers";
import { libraryVersions } from "#e2e/utils/library-versions.gen";

import { FromJsonPage } from "./index.e2e.model";

const test = createTest({ fromJsonPage: FromJsonPage });

test.beforeEach("Go to JSON schema from-json page", async ({ fromJsonPage, fontsLoaded }) => {
  await fromJsonPage.goto();

  await fontsLoaded();
});

test.describe("desktop view", { tag: "@desktop" }, () => {
  test.beforeEach(async ({ fromJsonPage }) => {
    await fromJsonPage.desktop.tableHandle.init();
  });

  test("it displays results table", async ({ fromJsonPage }) => {
    await expect(fromJsonPage.desktop.table).toBeVisible();

    const zodRow = fromJsonPage.desktop.tableHandle.getRow({ library: "zod" });

    await expect(zodRow.getCell("version")).toHaveText(libraryVersions.zod);
  });

  test("table can be sorted by column", async ({ fromJsonPage }) => {
    await helpers.desktop.expectTableSorting(fromJsonPage.desktop.tableHandle, {
      first: /arktype/i,
      last: /zod/i,
    });
  });
});

test.describe("mobile view", { tag: "@mobile" }, () => {
  test("it displays results cards", async ({ fromJsonPage }) => {
    const card = fromJsonPage.mobile.getCardByLibraryName("zod");

    await card.scrollIntoViewIfNeeded();

    await expect(card).toBeVisible();

    const versionEl = card.getByText(libraryVersions.zod);

    await expect(versionEl).toBeVisible();
  });
});
