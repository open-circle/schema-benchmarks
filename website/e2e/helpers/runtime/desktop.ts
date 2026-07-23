import { expect } from "#e2e/fixtures";
import type { RuntimePage } from "#e2e/fixtures/pages/_runtime";
import { library } from "#e2e/utils/constants";

export async function testTableDisplay(runtimePage: RuntimePage) {
  await expect(runtimePage.desktop.table).toBeVisible();

  const superstructRow = runtimePage.desktop.table
    .getByRole("row")
    .filter({ hasText: library.name });
  const superstructVersionCell = await runtimePage.desktop.getCellByColumnName(
    superstructRow,
    "Version",
  );

  await expect(superstructVersionCell).toHaveText(library.version);
}

export async function testTableSorting(
  runtimePage: RuntimePage,
  patterns: { first: RegExp; last: RegExp },
) {
  const libraryHeaderCell = runtimePage.desktop.getHeaderCell("Library");
  const librarySortLink = libraryHeaderCell.getByRole("link");

  await librarySortLink.click();

  await expect(libraryHeaderCell).toHaveAttribute("aria-sort", "ascending");

  const firstRow = runtimePage.desktop.table.getByRole("row").nth(1);
  const firstRowLibraryCell = await runtimePage.desktop.getCellByColumnName(firstRow, "Library");

  await expect(firstRowLibraryCell).toHaveText(patterns.first);

  await expect(async () => {
    await librarySortLink.click();

    await expect(libraryHeaderCell).toHaveAttribute("aria-sort", "descending");
  }).toPass();

  await expect(firstRowLibraryCell).toHaveText(patterns.last);
}
