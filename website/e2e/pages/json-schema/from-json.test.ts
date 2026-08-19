import { test, expect } from "#e2e/fixtures";

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

    await expect(zodRow.getCell("version")).toHaveText(/^\d+\.\d+\.\d+$/);
  });

  test("table can be sorted by column", async ({ fromJsonPage }) => {
    const libraryHeaderCell = await fromJsonPage.desktop.tableHandle.getHeaderCell("library");
    const librarySortLink = libraryHeaderCell.getByRole("link");

    await librarySortLink.click();

    await expect(libraryHeaderCell).toHaveSort("ascending");

    const firstRow = fromJsonPage.desktop.tableHandle.getRowByIndex(0);
    const firstRowLibraryCell = firstRow.getCell("library");

    await expect(firstRowLibraryCell).toHaveText(/arktype/i);
  });
});

test.describe("mobile view", { tag: "@mobile" }, () => {
  test("it displays results cards", async ({ fromJsonPage }) => {
    const card = fromJsonPage.mobile.getCardByLibraryName("zod");

    await card.scrollIntoViewIfNeeded();

    await expect(card).toBeVisible();

    const versionEl = card.getByText(/\d+\.\d+\.\d+/);

    await expect(versionEl).toBeVisible();
  });
});
